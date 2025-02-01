const mongoose = require('mongoose');

const HelpRequestSchema = new mongoose.Schema({
  description: { type: String, required: true },
  category: { type: String, required: true },
  tags: [{ type: String }], // Store tags as an array of strings
  attachments: [{ name: String, url: String, type: String }], // Store file details
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('HelpRequest', HelpRequestSchema);
