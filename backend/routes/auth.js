const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    console.log('Registration request received:', req.body);
    const { name, email, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ name, email, password });
    await user.save();
    console.log('User saved to database:', user._id);

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.status(201).json({ token, user: { id: user._id, name, email } });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    console.log('Login request received:', req.body);
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    console.log('Login successful for user:', user.email);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Admin Login
router.post('/admin-login', async (req, res) => {
  try {
    const { adminId, password } = req.body;
    
    const admin = await User.findOne({ email: adminId, isAdmin: true });
    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(400).json({ message: 'Invalid admin credentials' });
    }

    const token = jwt.sign({ userId: admin._id, isAdmin: true }, process.env.JWT_SECRET);
    res.json({ token, admin: { id: admin._id, name: admin.name, email: admin.email } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get User Data
router.get('/users/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Save Personal Information
router.put('/users/:userId/personal-info', async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, fatherName, motherName, mobile, aadhaar, pan, income, ifsc, bank, email } = req.body;
    
    const user = await User.findByIdAndUpdate(
      userId,
      {
        name,
        fatherName,
        motherName,
        mobile,
        aadhaar,
        pan,
        income,
        ifsc,
        bank,
        email,
        isPersonalInfoCompleted: true
      },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'Personal information saved successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;