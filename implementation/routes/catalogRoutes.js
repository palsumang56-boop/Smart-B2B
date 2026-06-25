const express = require('express');
const router = express.Router();
const Product = require('../models/Product'); // Ensure correct path to your Product model

// GET products by Wholesaler ID (Jab Retailer kisi wholesaler pe click kare)
router.get('/wholesaler/:wholesalerId', async (req, res) => {
  try {
    const products = await Product.find({ wholesalerId: req.params.wholesalerId });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST add a new product (Jab Wholesaler "+ Add Stock" modal se submit kare)
router.post('/', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;