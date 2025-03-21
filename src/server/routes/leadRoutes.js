
const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');

// Get all leads
router.get('/', async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    console.error('Error getting leads:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get guest leads
router.get('/guests', async (req, res) => {
  try {
    const leads = await Lead.find({ isGuest: true }).sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    console.error('Error getting guest leads:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get registered user leads
router.get('/registered', async (req, res) => {
  try {
    const leads = await Lead.find({ isGuest: false }).sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    console.error('Error getting registered leads:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get leads by user email
router.get('/user/:email', async (req, res) => {
  try {
    const email = req.params.email;
    console.log(`Finding leads for email: ${email}`);
    const leads = await Lead.find({ email }).sort({ createdAt: -1 });
    console.log(`Found ${leads.length} leads for user ${email}`);
    res.json(leads);
  } catch (error) {
    console.error(`Error getting leads for user ${req.params.email}:`, error);
    res.status(500).json({ message: error.message });
  }
});

// Get a single lead
router.get('/:id', async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    res.json(lead);
  } catch (error) {
    console.error(`Error getting lead ${req.params.id}:`, error);
    res.status(500).json({ message: error.message });
  }
});

// Create a new lead
router.post('/', async (req, res) => {
  try {
    console.log('Creating new lead with data:', req.body);
    const lead = new Lead({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone || '',
      company: req.body.company || '',
      status: req.body.status || 'new',
      source: req.body.source || 'website',
      score: req.body.score || 0,
      message: req.body.message || '',
      requestType: req.body.requestType || '',
      lastActivity: 'Lead created',
      interactions: 0,
      isGuest: req.body.isGuest !== undefined ? req.body.isGuest : true
    });
    
    const newLead = await lead.save();
    console.log('Lead created successfully:', newLead);
    res.status(201).json(newLead);
  } catch (error) {
    console.error('Error creating lead:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update lead status
router.patch('/:id/status', async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    
    lead.status = req.body.status;
    lead.lastActivity = `Status updated to ${req.body.status}`;
    
    const updatedLead = await lead.save();
    res.json(updatedLead);
  } catch (error) {
    console.error(`Error updating status for lead ${req.params.id}:`, error);
    res.status(500).json({ message: error.message });
  }
});

// Add interaction to lead
router.post('/:id/interactions', async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    
    // Create a new interaction
    lead.interactionsData.push({
      message: req.body.message,
      date: new Date()
    });
    
    // Update the interactions count
    lead.interactions = lead.interactionsData.length;
    
    // Update last activity
    lead.lastActivity = 'New interaction added';
    
    const updatedLead = await lead.save();
    res.json(updatedLead);
  } catch (error) {
    console.error(`Error adding interaction to lead ${req.params.id}:`, error);
    res.status(500).json({ message: error.message });
  }
});

// Update lead
router.patch('/:id', async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    
    // Update allowed fields
    const allowedUpdates = [
      'name', 'email', 'phone', 'company', 'status', 
      'source', 'score', 'message', 'requestType', 'analysis'
    ];
    
    allowedUpdates.forEach(update => {
      if (req.body[update] !== undefined) {
        lead[update] = req.body[update];
      }
    });
    
    // Update last activity
    lead.lastActivity = 'Lead details updated';
    
    const updatedLead = await lead.save();
    res.json(updatedLead);
  } catch (error) {
    console.error(`Error updating lead ${req.params.id}:`, error);
    res.status(500).json({ message: error.message });
  }
});

// Delete lead
router.delete('/:id', async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    
    await Lead.deleteOne({ _id: req.params.id });
    res.json({ message: 'Lead deleted' });
  } catch (error) {
    console.error(`Error deleting lead ${req.params.id}:`, error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
