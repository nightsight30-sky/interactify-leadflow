
const express = require('express');
const router = express.Router();
const { store, getNextLeadId } = require('../db');

// Get all leads
router.get('/', async (req, res) => {
  try {
    console.log('Fetching all leads...');
    const leads = [...store.leads].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    console.log(`Found ${leads.length} leads`);
    res.json(leads);
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get guest leads
router.get('/guests', async (req, res) => {
  try {
    console.log('Fetching guest leads...');
    const leads = store.leads
      .filter(lead => lead.isGuest === true)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    console.log(`Found ${leads.length} guest leads`);
    res.json(leads);
  } catch (error) {
    console.error('Error fetching guest leads:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get registered user leads
router.get('/registered', async (req, res) => {
  try {
    console.log('Fetching registered user leads...');
    const leads = store.leads
      .filter(lead => lead.isGuest === false)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    console.log(`Found ${leads.length} registered user leads`);
    res.json(leads);
  } catch (error) {
    console.error('Error fetching registered user leads:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get leads for a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log(`Fetching leads for user ${userId}...`);
    
    // For demo purposes, returning a subset of leads
    const leads = store.leads.slice(0, 5).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    console.log(`Found ${leads.length} leads for user ${userId}`);
    res.json(leads);
  } catch (error) {
    console.error(`Error fetching leads for user ${req.params.userId}:`, error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get a single lead
router.get('/:id', async (req, res) => {
  try {
    console.log(`Fetching lead with ID ${req.params.id}...`);
    const lead = store.leads.find(l => l._id === req.params.id);
    
    if (!lead) {
      console.log(`Lead with ID ${req.params.id} not found`);
      return res.status(404).json({ message: 'Lead not found' });
    }
    
    console.log(`Lead with ID ${req.params.id} found`);
    res.json(lead);
  } catch (error) {
    console.error(`Error fetching lead with ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create a new lead
router.post('/', async (req, res) => {
  try {
    console.log('Creating new lead with data:', req.body);
    
    const _id = getNextLeadId();
    const createdAt = new Date();
    
    // Create the lead with default values for any missing fields
    const newLead = {
      _id,
      ...req.body,
      interactions: req.body.interactions || 0,
      score: req.body.score || 0,
      status: req.body.status || 'new',
      source: req.body.source || 'website',
      isGuest: req.body.isGuest !== undefined ? req.body.isGuest : true,
      lastActivity: 'Just now',
      createdAt
    };
    
    store.leads.push(newLead);
    console.log('Lead created successfully with ID:', _id);
    res.status(201).json(newLead);
  } catch (error) {
    console.error('Error creating lead:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update a lead
router.patch('/:id', async (req, res) => {
  try {
    console.log(`Updating lead with ID ${req.params.id}...`);
    const leadIndex = store.leads.findIndex(l => l._id === req.params.id);
    
    if (leadIndex === -1) {
      console.log(`Lead with ID ${req.params.id} not found for update`);
      return res.status(404).json({ message: 'Lead not found' });
    }
    
    const updatedLead = {
      ...store.leads[leadIndex],
      ...req.body,
      lastActivity: 'Just now'
    };
    
    store.leads[leadIndex] = updatedLead;
    
    console.log(`Lead with ID ${req.params.id} updated successfully`);
    res.json(updatedLead);
  } catch (error) {
    console.error(`Error updating lead with ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update lead status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    console.log(`Updating status for lead with ID ${req.params.id} to ${status}...`);
    
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }
    
    const leadIndex = store.leads.findIndex(l => l._id === req.params.id);
    
    if (leadIndex === -1) {
      console.log(`Lead with ID ${req.params.id} not found for status update`);
      return res.status(404).json({ message: 'Lead not found' });
    }
    
    store.leads[leadIndex] = {
      ...store.leads[leadIndex],
      status,
      lastActivity: 'Just now'
    };
    
    console.log(`Status for lead with ID ${req.params.id} updated successfully to ${status}`);
    res.json(store.leads[leadIndex]);
  } catch (error) {
    console.error(`Error updating status for lead with ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add an interaction to a lead
router.post('/:id/interactions', async (req, res) => {
  try {
    const { message } = req.body;
    console.log(`Adding interaction to lead with ID ${req.params.id}: ${message}`);
    
    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }
    
    const leadIndex = store.leads.findIndex(l => l._id === req.params.id);
    
    if (leadIndex === -1) {
      console.log(`Lead with ID ${req.params.id} not found for adding interaction`);
      return res.status(404).json({ message: 'Lead not found' });
    }
    
    // Add the new interaction
    const interaction = {
      message,
      date: new Date()
    };
    
    if (!store.leads[leadIndex].interactionsData) {
      store.leads[leadIndex].interactionsData = [];
    }
    
    store.leads[leadIndex].interactionsData.push(interaction);
    store.leads[leadIndex].interactions = store.leads[leadIndex].interactionsData.length;
    store.leads[leadIndex].lastActivity = 'Just now';
    
    const updatedLead = store.leads[leadIndex];
    console.log(`Interaction added to lead with ID ${req.params.id} successfully`);
    res.json(updatedLead);
  } catch (error) {
    console.error(`Error adding interaction to lead with ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete a lead
router.delete('/:id', async (req, res) => {
  try {
    console.log(`Deleting lead with ID ${req.params.id}...`);
    const leadIndex = store.leads.findIndex(l => l._id === req.params.id);
    
    if (leadIndex === -1) {
      console.log(`Lead with ID ${req.params.id} not found for deletion`);
      return res.status(404).json({ message: 'Lead not found' });
    }
    
    const deletedLead = store.leads[leadIndex];
    store.leads.splice(leadIndex, 1);
    
    console.log(`Lead with ID ${req.params.id} deleted successfully`);
    res.json({ message: 'Lead deleted' });
  } catch (error) {
    console.error(`Error deleting lead with ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
