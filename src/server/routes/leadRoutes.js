
const express = require('express');
const router = express.Router();
const { store, getNextLeadId } = require('../db');

// Get all leads
router.get('/', async (req, res) => {
  try {
    const leads = store.leads;
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get lead by ID
router.get('/:id', getLead, (req, res) => {
  res.json(res.lead);
});

// Get registered user leads (non-guest leads)
router.get('/user/:email', async (req, res) => {
  try {
    const userLeads = store.leads.filter(lead => lead.email === req.params.email);
    res.json(userLeads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all registered user leads (non-guest leads)
router.get('/registered', async (req, res) => {
  try {
    const registeredLeads = store.leads.filter(lead => lead.isGuest === false);
    res.json(registeredLeads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new lead
router.post('/', async (req, res) => {
  try {
    const id = getNextLeadId();
    
    // Set default values for optional fields
    const isGuest = req.body.isGuest !== undefined ? req.body.isGuest : true;
    const score = req.body.score || 0;
    const interactions = req.body.interactions || 0;
    const lastActivity = req.body.lastActivity || 'Just now';
    
    const lead = {
      id,
      name: req.body.name,
      email: req.body.email,
      requestType: req.body.requestType,
      message: req.body.message,
      status: req.body.status || 'new',
      source: req.body.source || 'website',
      score,
      interactions,
      lastActivity,
      isGuest,
      createdAt: new Date()
    };

    store.leads.push(lead);
    console.log(`Lead created: ${id}`, lead);
    res.status(201).json(lead);
  } catch (error) {
    console.error('Error creating lead:', error);
    res.status(400).json({ message: error.message });
  }
});

// Update a lead
router.patch('/:id', getLead, async (req, res) => {
  if (req.body.name) res.lead.name = req.body.name;
  if (req.body.email) res.lead.email = req.body.email;
  if (req.body.status) res.lead.status = req.body.status;
  if (req.body.requestType) res.lead.requestType = req.body.requestType;
  if (req.body.message) res.lead.message = req.body.message;
  if (req.body.source) res.lead.source = req.body.source;
  if (req.body.score !== undefined) res.lead.score = req.body.score;
  if (req.body.interactions !== undefined) res.lead.interactions = req.body.interactions;
  if (req.body.lastActivity) res.lead.lastActivity = req.body.lastActivity;
  if (req.body.isGuest !== undefined) res.lead.isGuest = req.body.isGuest;

  try {
    const leadIndex = store.leads.findIndex(l => l.id === req.params.id);
    store.leads[leadIndex] = res.lead;
    res.json(res.lead);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a lead
router.delete('/:id', getLead, async (req, res) => {
  try {
    const leadIndex = store.leads.findIndex(l => l.id === req.params.id);
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
    lead = store.leads.find(l => l.id === req.params.id);
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
