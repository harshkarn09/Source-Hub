const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {
  createHelpRequest,
  getHelpRequests,
  upvoteHelpRequest,
  addReply,
} = require('../controllers/helpController');

const router = express.Router();

// Configure upload directory
const uploadDir = path.join(__dirname, '../uploads');

// Ensure directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'text/plain'];
  allowedTypes.includes(file.mimetype) ? cb(null, true) : cb(new Error('Invalid file type'));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB file size
});

// Routes
router.post('/', upload.array('attachments', 5), createHelpRequest);
router.get('/', getHelpRequests);
router.post('/upvote/:requestId', upvoteHelpRequest);
router.post('/reply/:id', addReply); // Added route for replies

module.exports = router;
