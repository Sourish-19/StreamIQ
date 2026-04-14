require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Route imports
const authRoutes = require('./routes/authRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const contentRoutes = require('./routes/contentRoutes');
const reportRoutes = require('./routes/reportRoutes');

// Initialize App
const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Main Routes
app.use('/api/auth', authRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/reports', reportRoutes);

// Base route test
app.get('/', (req, res) => {
  res.send('StreamIQ Analytics API is running');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
