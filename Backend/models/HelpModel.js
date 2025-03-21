const mongoose = require('mongoose');

const helpRequestSchema = new mongoose.Schema(
  {
    description: { type: String, required: true },
    category: { type: String, required: true },
    tags: { type: [String], default: [] },
    attachments: [{
      name: { type: String },
      url: { type: String },
      type: { type: String },
    }],
    upvotes: { type: Number, default: 0 },
    replies: [{ // Adding replies field
      user: { type: String, required: true },
      message: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    }],
  },
  { timestamps: true }
);

const HelpRequest = mongoose.model('HelpRequest', helpRequestSchema);
module.exports = HelpRequest;
