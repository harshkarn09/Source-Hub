const LostFound = require('../models/LostFound');
const fs = require('fs');

// Ensure uploads folder exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Submit a lost and found entry
const submitLostFound = async (req, res) => {
  try {
    const { description } = req.body;
    if (!description) {
      return res.status(400).json({ message: 'Description is required' });
    }

    const imagePaths = req.files && req.files.length ? req.files.map(file => `/uploads/${file.filename}`) : [];

    const newItem = new LostFound({
      description,
      images: imagePaths,
    });

    await newItem.save();
    res.status(201).json({ message: 'Item submitted successfully', item: newItem });
  } catch (error) {
    console.error('Error submitting lost item:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Fetch all lost and found items
const getAllLostFound = async (req, res) => {
  try {
    const items = await LostFound.find().sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    console.error('Error fetching lost items:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Submit a reply to a lost and found entry
const submitReply = async (req, res) => {
  try {
    const { itemId, user, message } = req.body;

    if (!itemId || !user || !message || !user.trim() || !message.trim()) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const item = await LostFound.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    item.replies.push({ user, message });
    await item.save();

    res.status(201).json({ message: 'Reply added successfully', item });
  } catch (error) {
    console.error('Error submitting reply:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { submitLostFound, getAllLostFound, submitReply };
