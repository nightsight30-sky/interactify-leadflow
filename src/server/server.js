
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./db');
const leadRoutes = require('./routes/leadRoutes');
const emailRoutes = require('./routes/emailRoutes');
const adminRoutes = require('./routes/adminRoutes');
require('dotenv').config();

// Connect to local in-memory database
connectDB().then(() => {
  console.log('In-memory data store initialized successfully');
}).catch(err => {
  console.error('Failed to initialize in-memory data store:', err);
});

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/leads', leadRoutes);
app.use('/api/emails', emailRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.send('API is running with in-memory storage...');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ message: 'Server error', error: err.message });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
