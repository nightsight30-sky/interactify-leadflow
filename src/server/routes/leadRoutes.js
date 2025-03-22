
const express = require('express');
const router = express.Router();
const { store, getNextLeadId } = require('../db');

// Get all leads
router.get('/', async (req, res) => {
  try {
    const leads = [...store.leads].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single lead
router.get('/:id', getLead, (req, res) => {
  res.json(res.lead);
});

// Create a new lead
router.post('/', async (req, res) => {
  try {
    const id = getNextLeadId();
    const lead = {
      _id: id,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      company: req.body.company,
      status: req.body.status,
      source: req.body.source,
      message: req.body.message,
      requestType: req.body.requestType,
      score: req.body.score || Math.floor(Math.random() * 100) + 1,
      interactions: req.body.interactions || 0,
      lastActivity: new Date().toISOString(),
      isGuest: req.body.isGuest || false,
      createdAt: new Date().toISOString()
    };

    store.leads.push(lead);
    res.status(201).json(lead);
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
  if (req.body.message) res.lead.message = req.body.message;
  if (req.body.requestType) res.lead.requestType = req.body.requestType;
  if (req.body.score) res.lead.score = req.body.score;
  if (req.body.interactions) res.lead.interactions = req.body.interactions;
  res.lead.lastActivity = new Date().toISOString();

  try {
    const leadIndex = store.leads.findIndex(l => l._id === req.params.id);
    store.leads[leadIndex] = res.lead;
    res.json(res.lead);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a lead
router.delete('/:id', getLead, async (req, res) => {
  try {
    const leadIndex = store.leads.findIndex(l => l._id === req.params.id);
    store.leads.splice(leadIndex, 1);
    res.json({ message: 'Lead deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Middleware to get lead by ID
async function getLead(req, res, next) {
  let lead;
  try {
    lead = store.leads.find(l => l._id === req.params.id);
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
