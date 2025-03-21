const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const helpRoutes = require('./routes/helpRoutes');
const lostFoundRoutes = require('./routes/lostFoundRoutes');
const marketingHelpRoutes = require("./routes/marketingHelpRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ 
  origin: 'http://192.168.0.179:8081', 
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json()); // Ensure JSON middleware is set before routes

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/nativeApp', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/help', helpRoutes);
app.use('/api/lost-found', lostFoundRoutes);  // ✅ Correct Route Registration
app.use("/api/marketingHelp", marketingHelpRoutes);
// Serve static files from "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
