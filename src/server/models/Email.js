
const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
  to: {
    type: String,
    required: true
  },
  from: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  cc: [String],
  bcc: [String],
  date: {
    type: Date,
    default: Date.now
  },
  leadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead'
  },
  read: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Email', emailSchema);
