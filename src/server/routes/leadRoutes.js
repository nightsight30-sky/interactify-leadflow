
const express = require('express');
const router = express.Router();
const { store, getNextLeadId } = require('../db');

// Get all leads
router.get('/', (req, res) => {
  try {
    console.log('Fetching all leads...');
    res.json(store.leads);
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get lead by ID
router.get('/:id', (req, res) => {
  try {
    const lead = store.leads.find(lead => lead.id === req.params.id);
    
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    
    res.json(lead);
  } catch (error) {
    console.error('Error fetching lead:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get leads for a specific user by email
router.get('/user/:email', (req, res) => {
  try {
    const email = req.params.email;
    console.log(`Fetching leads for user: ${email}`);
    
    const userLeads = store.leads.filter(lead => lead.email === email);
    res.json(userLeads);
  } catch (error) {
    console.error('Error fetching user leads:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get guest leads
router.get('/guests', (req, res) => {
  try {
    const guestLeads = store.leads.filter(lead => lead.isGuest === true);
    res.json(guestLeads);
  } catch (error) {
    console.error('Error fetching guest leads:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get registered user leads
router.get('/registered', (req, res) => {
  try {
    const registeredLeads = store.leads.filter(lead => !lead.isGuest);
    res.json(registeredLeads);
  } catch (error) {
    console.error('Error fetching registered leads:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create a new lead
router.post('/', (req, res) => {
  try {
    console.log('Creating new lead with data:', req.body);
    
    // Generate a new ID for the lead
    const id = getNextLeadId();
    
    // Create a new lead with the provided data and current timestamp
    const newLead = {
      id,
      ...req.body,
      createdAt: new Date(),
      lastActivity: new Date().toISOString(),
      // Set default values if not provided
      status: req.body.status || 'new',
      source: req.body.source || 'website',
      score: req.body.score || Math.floor(Math.random() * 100),
      interactions: req.body.interactions || 0,
      interactionsData: req.body.interactionsData || []
    };
    
    // Add the new lead to the store
    store.leads.push(newLead);
    
    console.log('New lead created:', newLead);
    res.status(201).json(newLead);
  } catch (error) {
    console.error('Error creating lead:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update a lead
router.patch('/:id', (req, res) => {
  try {
    const leadIndex = store.leads.findIndex(lead => lead.id === req.params.id);
    
    if (leadIndex === -1) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    
    // Update the lead with the provided data
    const updatedLead = {
      ...store.leads[leadIndex],
      ...req.body,
      lastActivity: new Date().toISOString()
    };
    
    store.leads[leadIndex] = updatedLead;
    
    res.json(updatedLead);
  } catch (error) {
    console.error('Error updating lead:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update lead status
router.patch('/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    const leadIndex = store.leads.findIndex(lead => lead.id === req.params.id);
    
    if (leadIndex === -1) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    
    // Update the lead status
    store.leads[leadIndex].status = status;
    store.leads[leadIndex].lastActivity = new Date().toISOString();
    
    res.json(store.leads[leadIndex]);
  } catch (error) {
    console.error('Error updating lead status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add an interaction to a lead
router.post('/:id/interactions', (req, res) => {
  try {
    const { message } = req.body;
    const leadIndex = store.leads.findIndex(lead => lead.id === req.params.id);
    
    if (leadIndex === -1) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    
    // Increment the interactions count
    store.leads[leadIndex].interactions += 1;
    
    // Update the last activity timestamp
    store.leads[leadIndex].lastActivity = new Date().toISOString();
    
    // Add the new interaction to the interactions data array
    if (!store.leads[leadIndex].interactionsData) {
      store.leads[leadIndex].interactionsData = [];
    }
    
    store.leads[leadIndex].interactionsData.push({
      message,
      date: new Date()
    });
    
    res.json(store.leads[leadIndex]);
  } catch (error) {
    console.error('Error adding interaction:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete a lead
router.delete('/:id', (req, res) => {
  try {
    const leadIndex = store.leads.findIndex(lead => lead.id === req.params.id);
    
    if (leadIndex === -1) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    
    // Remove the lead from the store
    store.leads.splice(leadIndex, 1);
    
    res.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    console.error('Error deleting lead:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
