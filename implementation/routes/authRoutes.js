// routes/authRoutes.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// 1. REGISTRATION ROUTE
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email already in use' });

    // Hash the password securely
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    res.status(201).json({ message: 'User registered successfully', userId: user._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. LOGIN ROUTE
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Verify the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    // Generate the JWT containing the user ID and Role
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'super_secret_fallback_key',
      { expiresIn: '1d' }
    );

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET sabhi retailers ko fetch karne ke liye
router.get('/retailers', async (req, res) => {
  try {
    // Database se sirf un users ko nikalenge jo RETAILER hain
    // .select('-password') ka matlab hai ki security ke liye password frontend par nahi bhejna
    const retailers = await User.find({ role: 'RETAILER' }).select('-password');
    res.json(retailers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET sabhi Wholesalers ko fetch karne ke liye (Retailer Dashboard ke liye)
router.get('/wholesalers', async (req, res) => {
  try {
    const wholesalers = await User.find({ role: 'WHOLESALER' }).select('-password');
    res.json(wholesalers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;