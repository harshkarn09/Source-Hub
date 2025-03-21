const mongoose = require('mongoose');

const LostFoundSchema = new mongoose.Schema(
  {
    description: { type: String, required: true },
    images: [{ type: String }], // Array of image URLs
    replies: [
      {
        user: { type: String, required: true }, // Username or User ID
        message: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const LostFound = mongoose.model('LostFound', LostFoundSchema);
module.exports = LostFound;
