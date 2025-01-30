const HelpRequest = require('../models/HelpModel');

const createHelpRequest = async (req, res) => {
  try {
    const { description, category, tags } = req.body;
    const attachments = req.files.map(file => file.path);

    const newHelpRequest = new HelpRequest({ description, category, tags, attachments });
    await newHelpRequest.save();

    res.status(201).json({ message: 'Help request submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to submit help request', error: error.message });
  }
};

const getHelpRequests = async (req, res) => {
  try {
    const { category, search } = req.query;
    let filter = {};
    if (category) filter.category = category;
    if (search) filter.description = { $regex: search, $options: 'i' };

    const helpRequests = await HelpRequest.find(filter);
    res.status(200).json(helpRequests);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch help requests', error: error.message });
  }
};

module.exports = { createHelpRequest, getHelpRequests };
