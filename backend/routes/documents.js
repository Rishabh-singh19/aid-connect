const express = require('express');
const multer = require('multer');
const path = require('path');
const User = require('../models/User');
const router = express.Router();

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images and PDFs allowed'));
    }
  }
});

// Upload photo
router.post('/upload-photo', upload.single('photo'), async (req, res) => {
  try {
    console.log('Photo upload request:', req.body);
    const { userId, schemeTitle, applicationId } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    console.log('Uploaded file:', req.file.filename);
    
    // Update user with photo
    const updateData = { photo: req.file.filename };
    if (schemeTitle) {
      updateData.lastAppliedScheme = schemeTitle;
    }
    
    await User.findByIdAndUpdate(userId, updateData);
    
    // If there's an application, update it with photo
    if (applicationId) {
      const Application = require('../models/Application');
      await Application.findByIdAndUpdate(applicationId, { 
        photoFilename: req.file.filename,
        photoUploaded: true
      });
      console.log('Updated application with photo:', applicationId);
    }
    
    res.json({ 
      message: 'Photo uploaded successfully', 
      filename: req.file.filename,
      schemeTitle: schemeTitle || 'No scheme'
    });
  } catch (error) {
    console.error('Photo upload error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Upload documents
router.post('/upload-documents', upload.fields([
  { name: 'signature', maxCount: 1 },
  { name: 'aadhaar', maxCount: 1 },
  { name: 'panCard', maxCount: 1 },
  { name: 'residentialCertificate', maxCount: 1 }
]), async (req, res) => {
  try {
    console.log('Documents upload request:', req.body);
    const { userId, applicationId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const documents = {};
    const uploadedFiles = [];

    if (req.files.signature) {
      documents.signature = req.files.signature[0].filename;
      uploadedFiles.push('signature');
      console.log('Signature uploaded:', req.files.signature[0].filename);
    }
    if (req.files.aadhaar) {
      documents.aadhaar = req.files.aadhaar[0].filename;
      uploadedFiles.push('aadhaar');
      console.log('Aadhaar uploaded:', req.files.aadhaar[0].filename);
    }
    if (req.files.panCard) {
      documents.panCard = req.files.panCard[0].filename;
      uploadedFiles.push('panCard');
      console.log('PAN Card uploaded:', req.files.panCard[0].filename);
    }
    if (req.files.residentialCertificate) {
      documents.residentialCertificate = req.files.residentialCertificate[0].filename;
      uploadedFiles.push('residentialCertificate');
      console.log('Residential Certificate uploaded:', req.files.residentialCertificate[0].filename);
    }

    // Update user documents in MongoDB
    const updatedUser = await User.findByIdAndUpdate(
      userId, 
      { documents }, 
      { new: true }
    );
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log('Documents saved to MongoDB for user:', userId);
    console.log('Updated user documents:', updatedUser.documents);
    
    // If there's an application, update it with documents
    if (applicationId) {
      const Application = require('../models/Application');
      await Application.findByIdAndUpdate(applicationId, { 
        documentsUploaded: true,
        documents: documents
      });
      console.log('Updated application with documents:', applicationId);
    }
    
    res.json({ 
      message: 'Documents uploaded successfully to MongoDB', 
      documents,
      uploadedFiles,
      userId
    });
  } catch (error) {
    console.error('Documents upload error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get user documents (for verification)
router.get('/user-documents/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select('documents');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ documents: user.documents });
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;