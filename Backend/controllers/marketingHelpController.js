const MarketingHelp = require('../models/MarketingHelpModel');

// Handle marketing help request submission
const submitMarketingHelp = async (req, res) => {
  try {
    const { description, price, paymentMethod } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null; // Save image URL

    const newHelp = new MarketingHelp({
      description,
      price,
      image: imageUrl,
      paymentMethod,
      paymentStatus: 'Pending' // Initially set to pending
    });

    await newHelp.save();
    res.status(201).json({ message: 'Marketing help request submitted successfully', newHelp });
  } catch (error) {
    res.status(500).json({ error: 'Error submitting request' });
  }
};

// Handle payment update (e.g., user completes payment)
const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;

    const updatedHelp = await MarketingHelp.findByIdAndUpdate(id, { paymentStatus }, { new: true });

    if (!updatedHelp) {
      return res.status(404).json({ error: 'Help request not found' });
    }

    res.json({ message: 'Payment status updated successfully', updatedHelp });
  } catch (error) {
    res.status(500).json({ error: 'Error updating payment status' });
  }
};

module.exports = { submitMarketingHelp, updatePaymentStatus };
