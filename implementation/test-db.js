// test-db.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
const RetailerCredit = require('./models/RetailerCredit');
const LedgerTransaction = require('./models/LedgerTransaction');

async function verifyDatabaseSetup() {
  try {
    console.log('Connecting to MongoDB Atlas Replica Set...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected successfully.\n');

    // Clear any previous test data to keep it clean
    await User.deleteMany({ email: { $in: ['wholesaler@test.com', 'retailer@test.com'] } });
    
    console.log('--- Step 1: Testing User Schema ---');
    const wholesaler = await User.create({
      name: 'Global Distributors',
      email: 'wholesaler@test.com',
      role: 'WHOLESALER'
    });
    const retailer = await User.create({
      name: 'Local Kirana Store',
      email: 'retailer@test.com',
      role: 'RETAILER'
    });
    console.log('✓ Users created successfully.');
    console.log(`Wholesaler ID: ${wholesaler._id}`);
    console.log(`Retailer ID: ${retailer._id}\n`);

    console.log('--- Step 2: Testing Product Schema ---');
    const product = await Product.create({
      wholesalerId: wholesaler._id,
      sku: 'SKU-TEST-101',
      name: 'Premium Basmati Rice 5kg',
      category: 'Grains',
      stockQuantity: 150,
      unitPrice: 12.50
    });
    console.log('✓ Product created successfully.');
    console.log(`Product SKU: ${product.sku}\n`);

    console.log('--- Step 3: Testing Retailer Credit Schema ---');
    const credit = await RetailerCredit.create({
      retailerId: retailer._id,
      wholesalerId: wholesaler._id,
      creditLimit: 5000,
      outstandingBalance: 0
    });
    console.log('✓ Credit Profile created successfully.');
    console.log(`Credit Limit Authorized: $${credit.creditLimit}\n`);

    console.log('--- Step 4: Testing Ledger Transaction Schema ---');
    const ledger = await LedgerTransaction.create({
      retailerId: retailer._id,
      wholesalerId: wholesaler._id,
      type: 'DEBIT',
      amount: 250.00,
      runningBalance: 250.00,
      description: 'Initial inventory acquisition deposit'
    });
    console.log('✓ Ledger Transaction written successfully.');
    console.log(`Transaction Type: ${ledger.type} | Amount: $${ledger.amount}\n`);

    console.log('--------------------------------------------------');
    console.log('🎉 Verification Success: All schemas instantiated perfectly in Atlas!');
    console.log('--------------------------------------------------');

  } catch (error) {
    console.error('❌ Verification Failed:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed safely.');
    process.exit(0);
  }
}

verifyDatabaseSetup();