const HelpRequest = require('../models/HelpModel');

// Create a new help request
const createHelpRequest = async (req, res) => {
  try {
    const { description, category, tags } = req.body;
    const attachments = req.files
      ? req.files.map((file) => ({
          name: file.originalname,
          url: `http://192.168.1.5:5000/uploads/${file.filename}`,
          type: file.mimetype,
        }))
      : [];

    const newHelpRequest = new HelpRequest({
      description,
      category,
      tags: tags.split(',').map((tag) => tag.trim()),
      attachments,
    });

    await newHelpRequest.save();
    res.status(201).json({ message: "Help request created successfully!", data: newHelpRequest });
  } catch (error) {
    console.error("Create help request error:", error);
    res.status(500).json({ message: "Failed to create help request." });
  }
};

// Get all help requests
const getHelpRequests = async (req, res) => {
  try {
    const requests = await HelpRequest.find().sort({ createdAt: -1 });
    res.status(200).json({ data: requests });
  } catch (error) {
    console.error("Fetch help requests error:", error);
    res.status(500).json({ message: "Failed to fetch help requests." });
  }
};

// Add a reply to the help request
const addReply = async (req, res) => {
  try {
    const { user, message } = req.body;
    const helpRequest = await HelpRequest.findById(req.params.id);

    if (!helpRequest) {
      return res.status(404).json({ message: "Help request not found" });
    }

    const newReply = { user, message, timestamp: new Date() };
    helpRequest.replies.push(newReply);
    await helpRequest.save();

    res.status(200).json({ message: "Reply added successfully", data: newReply });
  } catch (error) {
    console.error("Error adding reply:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Upvote help request
const upvoteHelpRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const request = await HelpRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Help request not found." });
    }

    request.upvotes += 1;
    await request.save();

    res.status(200).json({ message: "Upvoted successfully!", upvotes: request.upvotes });
  } catch (error) {
    console.error("Upvote error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = { createHelpRequest, getHelpRequests, upvoteHelpRequest, addReply };
