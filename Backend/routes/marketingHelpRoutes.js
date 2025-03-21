const express = require('express');
const multer = require('multer');
const path = require('path');
const { submitMarketingHelp, updatePaymentStatus } = require('../controllers/marketingHelpController');

const router = express.Router();

// Set up storage for uploaded images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Save images in the "uploads" folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  }
});

const upload = multer({ storage });

// POST route for submitting marketing help requests
router.post('/', upload.single('image'), submitMarketingHelp);

// PATCH route to update payment status
router.patch('/:id/payment', updatePaymentStatus);

module.exports = router;
