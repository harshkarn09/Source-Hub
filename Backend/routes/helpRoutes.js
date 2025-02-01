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
  destination: (req, file, cb) => cb(null, uploadDir), // Save files in "uploads" directory
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname), // Unique filename
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
router.post('/', upload.array('attachments', 5), createHelpRequest);

// GET request to fetch all help requests (with optional filters)
router.get('/', getHelpRequests);

module.exports = router;
