
const express = require('express');
const router = express.Router();
const { store, getNextEmailId } = require('../db');

// Get all emails
router.get('/', async (req, res) => {
  try {
    const emails = [...store.emails].sort((a, b) => new Date(b.date) - new Date(a.date));
    res.json(emails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get emails by lead ID
router.get('/lead/:leadId', async (req, res) => {
  try {
    const emails = store.emails
      .filter(email => email.leadId === req.params.leadId)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    res.json(emails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single email
router.get('/:id', getEmail, (req, res) => {
  res.json(res.email);
});

// Send an email
router.post('/', async (req, res) => {
  try {
    const id = getNextEmailId();
    const email = {
      _id: id,
      to: req.body.to,
      from: req.body.from,
      subject: req.body.subject,
      message: req.body.message,
      cc: req.body.cc || [],
      bcc: req.body.bcc || [],
      leadId: req.body.leadId,
      read: false,
      date: new Date()
    };

    store.emails.push(email);
    res.status(201).json(email);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Mark email as read
router.patch('/:id/read', getEmail, async (req, res) => {
  res.email.read = true;

  try {
    const emailIndex = store.emails.findIndex(e => e._id === req.params.id);
    store.emails[emailIndex] = res.email;
    res.json(res.email);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete an email
router.delete('/:id', getEmail, async (req, res) => {
  try {
    const emailIndex = store.emails.findIndex(e => e._id === req.params.id);
    store.emails.splice(emailIndex, 1);
    res.json({ message: 'Email deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Middleware to get email by ID
async function getEmail(req, res, next) {
  let email;
  try {
    email = store.emails.find(e => e._id === req.params.id);
    if (email == null) {
      return res.status(404).json({ message: 'Email not found' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  res.email = email;
  next();
}

module.exports = router;
