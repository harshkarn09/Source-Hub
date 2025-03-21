const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { submitLostFound, getAllLostFound, submitReply } = require('../controllers/lostFoundController');

// Configure Multer for image storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ensure the 'uploads' folder exists
  },
  filename: (req, file, cb) => {
    cb(null, `image-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

// Routes
router.post('/', upload.array('images', 3), submitLostFound);
router.get('/', getAllLostFound);
router.post('/reply', submitReply);

module.exports = router;
