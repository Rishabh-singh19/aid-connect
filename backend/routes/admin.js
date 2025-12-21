const express = require('express');
const User = require('../models/User');
const Application = require('../models/Application');
const router = express.Router();

// Get all data from MongoDB
router.get('/all-data', async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    const applications = await Application.find({}).populate('userId', 'name email');
    
    res.json({
      totalUsers: users.length,
      totalApplications: applications.length,
      users: users,
      applications: applications
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;