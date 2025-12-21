const express = require('express');
const Application = require('../models/Application');
const { generateApprovalPDF } = require('../services/pdfService');
const { sendApprovalEmail, sendRejectionEmail } = require('../services/emailService');
const router = express.Router();

// Apply for scheme
router.post('/apply', async (req, res) => {
  try {
    const { userId, schemeId, schemeTitle } = req.body;
    
    const application = new Application({
      userId,
      schemeId,
      schemeTitle
    });
    
    await application.save();
    res.status(201).json({ message: 'Applied successfully', applicationId: application._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get applications by user
router.get('/user/:userId', async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.params.userId })
      .populate('schemeId')
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get applications by scheme (for admin)
router.get('/scheme/:schemeId', async (req, res) => {
  try {
    const applications = await Application.find({ schemeId: req.params.schemeId })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all applications (for testing)
router.get('/all', async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json({ count: applications.length, applications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single application with scheme details
router.get('/:applicationId', async (req, res) => {
  try {
    const application = await Application.findById(req.params.applicationId)
      .populate('userId', 'name email photo documents fatherName motherName mobile aadhaar pan income ifsc bank isPersonalInfoCompleted');
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Mock scheme data (replace with actual scheme fetch)
    const scheme = {
      title: application.schemeTitle,
      description: 'Government scheme for eligible citizens',
      eligibility: [
        'Must be an Indian citizen',
        'Age between 18-60 years',
        'Valid Aadhaar card required',
        'Income certificate needed'
      ],
      benefits: 'Financial assistance and support services'
    };
    
    res.json({ application, scheme });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user notifications count
router.get('/notifications/:userId/count', async (req, res) => {
  try {
    const count = await Application.countDocuments({
      userId: req.params.userId,
      remarks: { $exists: true, $ne: '' }
    });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user messages (applications with remarks)
router.get('/messages/:userId', async (req, res) => {
  try {
    const applications = await Application.find({
      userId: req.params.userId,
      remarks: { $exists: true, $ne: '' }
    }).sort({ updatedAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update application status
router.put('/:applicationId/status', async (req, res) => {
  try {
    const { status, remarks } = req.body;
    
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const updateData = { status };
    if (remarks !== undefined) {
      updateData.remarks = remarks;
    }
    
    const application = await Application.findByIdAndUpdate(
      req.params.applicationId,
      updateData,
      { new: true }
    ).populate('userId', 'name email fatherName motherName mobile aadhaar pan income ifsc bank');
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    // Send email based on status
    if (status === 'approved') {
      try {
        const schemeData = {
          title: application.schemeTitle,
          description: 'Government scheme for eligible citizens'
        };
        
        const pdfBuffer = await generateApprovalPDF(application, application.userId, schemeData);
        await sendApprovalEmail(
          application.userId.email,
          application.userId.name,
          pdfBuffer,
          application._id
        );
        console.log('Approval email sent successfully');
        res.json({ message: 'Application approved and email sent successfully', application });
      } catch (emailError) {
        console.error('Email/PDF error (application still approved):', emailError);
        res.json({ message: 'Application approved (email failed)', application });
      }
    } else if (status === 'rejected') {
      try {
        await sendRejectionEmail(
          application.userId.email,
          application.userId.name,
          application._id,
          remarks
        );
        console.log('Rejection email sent successfully');
        res.json({ message: 'Application rejected and email sent successfully', application });
      } catch (emailError) {
        console.error('Email error (application still rejected):', emailError);
        res.json({ message: 'Application rejected (email failed)', application });
      }
    } else {
      res.json({ message: 'Status updated successfully', application });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;