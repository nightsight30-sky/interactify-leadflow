
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const leadRoutes = require('./routes/leadRoutes');
const emailRoutes = require('./routes/emailRoutes');
require('dotenv').config();

// Connect to database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/leads', leadRoutes);
app.use('/api/emails', emailRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
