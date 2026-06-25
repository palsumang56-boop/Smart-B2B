// routes/orderRoutes.js
const express = require('express');
const mongoose = require('mongoose');
const RetailerCredit = require('../models/RetailerCredit');
const LedgerTransaction = require('../models/LedgerTransaction');
const Product = require('../models/Product'); // Added the Product model for inventory checks
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

// --- NEW: Import the Background Worker Queue ---
const invoiceQueue = require('../queues/invoiceQueue');

const router = express.Router();

// POST ROUTE: Retailer Checkout
router.post('/checkout', verifyToken, verifyRole('RETAILER'), async (req, res) => {
  // Added productId and orderedQty to the destructured request body
  const { wholesalerId, orderValue, description, productId, orderedQty } = req.body;
  const retailerId = req.user.id; // From the decoded JWT

  // 1. Initialize the MongoDB Session
  const session = await mongoose.startSession();
  
  // 2. Start the Transaction Lock
  session.startTransaction();

  try {
    // 3. Prevent Inventory Race Conditions (Atomic Update)
    // We use $inc to deduct stock and $gte to ensure we never drop below zero.
    // This executes entirely within the database driver to prevent over-selling.
    const productUpdate = await Product.findOneAndUpdate(
      { 
        _id: productId, 
        stockQuantity: { $gte: orderedQty } 
      },
      { 
        $inc: { stockQuantity: -orderedQty } 
      },
      { session, new: true } 
    );

    // If productUpdate is null, the query filter failed (not enough stock) or product doesn't exist
    if (!productUpdate) {
       throw new Error('Order Blocked: Insufficient stock available for this item.');
    }

    // 4. Fetch the Retailer's Credit Profile (Important: chain .session(session) to lock this read)
    const creditProfile = await RetailerCredit.findOne({ 
      retailerId, 
      wholesalerId 
    }).session(session);

    if (!creditProfile) {
      throw new Error('Credit profile not found for this wholesaler.');
    }

    // 5. Verify the Core Business Rule
    const projectedBalance = creditProfile.outstandingBalance + orderValue;
    
    // Check if new order value + outstanding balance surpasses the credit limit
    if (projectedBalance > creditProfile.creditLimit) {
      // If it does, throw an error which immediately sends us to the catch block to abort
      throw new Error(`Order Blocked: Credit limit exceeded. You only have $${creditProfile.creditLimit - creditProfile.outstandingBalance} available.`);
    }

    // 6. If approved, update the Retailer Credit Profile
    creditProfile.outstandingBalance = projectedBalance;
    await creditProfile.save({ session }); // Pass session to the save method

    // 7. Write the order to the immutable Ledger
    // Note: When using Mongoose with transactions, .create() requires an array of documents
    const ledgerEntry = await LedgerTransaction.create([{
      retailerId,
      wholesalerId,
      orderId: null, // Explicitly defined as null for standalone ledger logic
      type: 'DEBIT',
      amount: orderValue,
      runningBalance: projectedBalance,
      description: description || 'Automated Order Placement'
    }], { session });

    // 8. Commit the Transaction (Saves everything permanently)
    await session.commitTransaction();
    
    // ---  REAL-TIME ALERT ---
    // Retrieve the Socket.io instance we saved in server.js
    const io = req.app.get('io');
    
    // Emit the 'new_order_received' event to all connected clients
    if (io) {
      io.emit('new_order_received', {
        message: 'New order requires fulfillment!',
        retailerId: retailerId,
        wholesalerId: wholesalerId,
        orderValue: orderValue,
        transactionId: ledgerEntry[0]._id,
        productId: productId,
        orderedQty: orderedQty
      });
    }
    // -------------------------------------

    // ---  BACKGROUND JOB ---
    // Push the heavy PDF generation task to the background queue.
    // The main server doesn't wait for this to finish; it moves on instantly.
    await invoiceQueue.add('generate-pdf-invoice', {
      transactionId: ledgerEntry[0]._id,
      retailerId: retailerId,
      amount: orderValue,
      date: new Date().toISOString()
    });
    // -------------------------------------

    res.status(200).json({ 
      message: 'Checkout successful. Order queued for invoice generation.', 
      transaction: ledgerEntry[0],
      remainingStock: productUpdate.stockQuantity // Included to confirm the new stock level
    });

  } catch (error) {
    // 9. Abort the Transaction if ANY step fails (Reverts all database changes)
    await session.abortTransaction();
    res.status(400).json({ error: error.message });
  } finally {
    // 10. Always end the session to free up database resources
    session.endSession();
  }
});

module.exports = router;