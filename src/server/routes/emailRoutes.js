
const express = require('express');
const router = express.Router();
const Email = require('../models/Email');

// Get all emails
router.get('/', async (req, res) => {
  try {
    const emails = await Email.find().sort({ date: -1 });
    res.json(emails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get emails by lead ID
router.get('/lead/:leadId', async (req, res) => {
  try {
    const emails = await Email.find({ leadId: req.params.leadId }).sort({ date: -1 });
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
  const email = new Email({
    to: req.body.to,
    from: req.body.from,
    subject: req.body.subject,
    message: req.body.message,
    cc: req.body.cc,
    bcc: req.body.bcc,
    leadId: req.body.leadId,
    read: false
  });

  try {
    const newEmail = await email.save();
    res.status(201).json(newEmail);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Mark email as read
router.patch('/:id/read', getEmail, async (req, res) => {
  res.email.read = true;

  try {
    const updatedEmail = await res.email.save();
    res.json(updatedEmail);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete an email
router.delete('/:id', getEmail, async (req, res) => {
  try {
    await res.email.remove();
    res.json({ message: 'Email deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Middleware to get email by ID
async function getEmail(req, res, next) {
  let email;
  try {
    email = await Email.findById(req.params.id);
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
