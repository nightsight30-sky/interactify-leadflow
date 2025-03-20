
const express = require('express');
const router = express.Router();
const Email = require('../models/Email');
const Lead = require('../models/Lead');

// Get all emails
router.get('/', async (req, res) => {
  try {
    const emails = await Email.find();
    res.json(emails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get emails by leadId
router.get('/lead/:leadId', async (req, res) => {
  try {
    const emails = await Email.find({ leadId: req.params.leadId });
    res.json(emails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Send an email (create)
router.post('/', async (req, res) => {
  const email = new Email({
    to: req.body.to,
    from: req.body.from,
    subject: req.body.subject,
    message: req.body.message,
    cc: req.body.cc || [],
    bcc: req.body.bcc || [],
    leadId: req.body.leadId,
    read: false
  });

  try {
    // In a real-world scenario, you would integrate with an email service here
    
    // Add interaction to lead if leadId is provided
    if (req.body.leadId) {
      const lead = await Lead.findById(req.body.leadId);
      if (lead) {
        lead.interactions.push({
          message: `Email sent: ${req.body.subject}`,
          date: new Date()
        });
        await lead.save();
      }
    }
    
    const newEmail = await email.save();
    res.status(201).json(newEmail);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Mark email as read
router.patch('/:id/read', async (req, res) => {
  try {
    const email = await Email.findById(req.params.id);
    if (!email) return res.status(404).json({ message: 'Email not found' });
    
    email.read = true;
    const updatedEmail = await email.save();
    res.json(updatedEmail);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete an email
router.delete('/:id', async (req, res) => {
  try {
    const email = await Email.findById(req.params.id);
    if (!email) return res.status(404).json({ message: 'Email not found' });
    
    await email.remove();
    res.json({ message: 'Email deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
