
const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');

// Get all leads
router.get('/', async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get guest leads
router.get('/guests', async (req, res) => {
  try {
    const leads = await Lead.find({ isGuest: true }).sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get registered user leads
router.get('/registered', async (req, res) => {
  try {
    const leads = await Lead.find({ isGuest: false }).sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get leads for a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    // In a real app, you'd use the userId to filter leads
    // For now, we'll just return all leads as an example
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single lead
router.get('/:id', getLead, (req, res) => {
  res.json(res.lead);
});

// Create a lead
router.post('/', async (req, res) => {
  const lead = new Lead({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    company: req.body.company,
    status: req.body.status || 'new',
    source: req.body.source || 'website',
    score: req.body.score || Math.floor(Math.random() * 100),
    message: req.body.message,
    requestType: req.body.requestType,
    lastActivity: req.body.lastActivity || 'Just now',
    isGuest: req.body.isGuest !== undefined ? req.body.isGuest : true,
    analysis: req.body.analysis
  });

  try {
    const newLead = await lead.save();
    res.status(201).json(newLead);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a lead
router.patch('/:id', getLead, async (req, res) => {
  if (req.body.name) res.lead.name = req.body.name;
  if (req.body.email) res.lead.email = req.body.email;
  if (req.body.phone) res.lead.phone = req.body.phone;
  if (req.body.company) res.lead.company = req.body.company;
  if (req.body.status) res.lead.status = req.body.status;
  if (req.body.source) res.lead.source = req.body.source;
  if (req.body.score) res.lead.score = req.body.score;
  if (req.body.message) res.lead.message = req.body.message;
  if (req.body.requestType) res.lead.requestType = req.body.requestType;
  if (req.body.lastActivity) res.lead.lastActivity = req.body.lastActivity;
  if (req.body.isGuest !== undefined) res.lead.isGuest = req.body.isGuest;
  if (req.body.analysis) res.lead.analysis = req.body.analysis;

  try {
    const updatedLead = await res.lead.save();
    res.json(updatedLead);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update lead status
router.patch('/:id/status', getLead, async (req, res) => {
  if (req.body.status) {
    res.lead.status = req.body.status;
    res.lead.lastActivity = 'Just now';
  }

  try {
    const updatedLead = await res.lead.save();
    res.json(updatedLead);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add interaction to a lead
router.post('/:id/interactions', getLead, async (req, res) => {
  if (req.body.message) {
    res.lead.interactions.push({
      message: req.body.message,
      date: new Date()
    });
    res.lead.lastActivity = 'Just now';
  }

  try {
    const updatedLead = await res.lead.save();
    res.json(updatedLead);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a lead
router.delete('/:id', getLead, async (req, res) => {
  try {
    await res.lead.remove();
    res.json({ message: 'Lead deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Middleware to get lead by ID
async function getLead(req, res, next) {
  let lead;
  try {
    lead = await Lead.findById(req.params.id);
    if (lead == null) {
      return res.status(404).json({ message: 'Lead not found' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  res.lead = lead;
  next();
}

module.exports = router;
