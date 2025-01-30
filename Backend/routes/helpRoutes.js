const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { createHelpRequest, getHelpRequests } = require('../controllers/helpController');

const router = express.Router();

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Save files in the "uploads" directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Unique filename
  },
});

// File Type Validation
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'text/plain'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, PNG, PDF, and TXT are allowed.'));
  }
};

// Multer Upload Middleware
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
});

// POST request to create a new help request (with file upload)
router.post('/', (req, res, next) => {
  console.log('Upload middleware triggered'); // Check if it reaches here

  upload.array('attachments', 5)(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.error('Multer error:', err);
      return res.status(400).json({ error: 'File upload error: ' + err.message });
    } else if (err) {
      console.error('Other error:', err);
      return res.status(400).json({ error: err.message });
    }
    
    console.log('Files uploaded:', req.files);
    next(); // Pass control to `createHelpRequest`
  });
}, createHelpRequest);


// GET request to fetch all help requests (with optional filters)
router.get('/', getHelpRequests);

module.exports = router;
