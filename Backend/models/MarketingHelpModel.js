const mongoose = require('mongoose');

const MarketingHelpSchema = new mongoose.Schema({
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  paymentMethod: { 
    type: String, 
    enum: ['Credit Card', 'Debit Card', 'PayPal', 'UPI', 'Net Banking'], 
    required: true 
  },
  paymentStatus: { 
    type: String, 
    enum: ['Pending', 'Completed', 'Failed'], 
    default: 'Pending' 
  }
}, { timestamps: true });

module.exports = mongoose.model('MarketingHelp', MarketingHelpSchema);
