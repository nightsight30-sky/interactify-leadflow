
const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  company: {
    type: String
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'qualified', 'converted', 'lost'],
    default: 'new'
  },
  source: {
    type: String,
    enum: ['website', 'referral', 'social', 'email', 'other'],
    default: 'website'
  },
  score: {
    type: Number,
    default: 0
  },
  message: {
    type: String
  },
  requestType: {
    type: String
  },
  lastActivity: {
    type: String
  },
  // Store the interactions count separately from the actual interactions data
  interactions: {
    type: Number,
    default: 0
  },
  // Store the actual interaction data
  interactionsData: [{
    message: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  isGuest: {
    type: Boolean,
    default: true
  },
  analysis: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Lead', leadSchema);
