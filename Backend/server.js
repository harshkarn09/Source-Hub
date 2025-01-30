const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const helpRoutes = require('./routes/helpRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('Uploads directory created');
}

// Middleware
app.use(cors({ origin: 'http://192.168.1.5:8081', methods: ['GET', 'POST'], allowedHeaders: ['Content-Type'] }));
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/nativeApp', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/help', helpRoutes);
app.use('/uploads', express.static('uploads'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
