// File: controllers/helpController.js
const HelpRequest = require('../models/HelpModel');

const createHelpRequest = async (req, res) => {
  try {
    const { description, category, tags } = req.body;
    
    // Get uploaded files and format their paths
    const attachments = req.files.map(file => `/uploads/${file.filename}`); // This is the critical fix
    
    const newHelpRequest = new HelpRequest({
      description,
      category,
      tags: Array.isArray(tags) ? tags : [tags], // Ensure tags are array
      attachments,
    });

    await newHelpRequest.save();

    res.status(201).json({ 
      message: 'Help request submitted successfully',
      data: newHelpRequest
    });
  } catch (error) {
    console.error('Error creating help request:', error);
    res.status(500).json({ 
      message: 'Failed to submit help request',
      error: error.message 
    });
  }
};

const getHelpRequests = async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = {};
    
    if (category) filter.category = category;
    if (search) filter.description = { $regex: search, $options: 'i' };

    const helpRequests = await HelpRequest.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(helpRequests);
  } catch (error) {
    console.error('Error fetching help requests:', error);
    res.status(500).json({ 
      message: 'Failed to fetch help requests',
      error: error.message 
    });
  }
};

module.exports = { createHelpRequest, getHelpRequests };