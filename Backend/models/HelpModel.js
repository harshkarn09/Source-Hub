const mongoose = require('mongoose');

const helpRequestSchema = new mongoose.Schema({
  description: { type: String, required: true },
  category: { type: String, enum: ['coding', 'college related', 'miscellaneous'], required: true },
  tags: { type: [String], default: [] },
  attachments: { type: [String] },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('HelpRequest', helpRequestSchema);
