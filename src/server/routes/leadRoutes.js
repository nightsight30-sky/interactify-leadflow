
const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');

// Get all leads
router.get('/', async (req, res) => {
  try {
    console.log('Fetching all leads...');
    const leads = await Lead.find().sort({ createdAt: -1 });
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
    const leads = await Lead.find({ isGuest: true }).sort({ createdAt: -1 });
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
    const leads = await Lead.find({ isGuest: false }).sort({ createdAt: -1 });
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
    // In a real app, you would filter by a user ID field
    const leads = await Lead.find().limit(5).sort({ createdAt: -1 });
    
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
    const lead = await Lead.findById(req.params.id);
    
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
    
    // Create the lead with default values for any missing fields
    const newLead = new Lead({
      ...req.body,
      interactions: req.body.interactions || 0,
      score: req.body.score || 0,
      status: req.body.status || 'new',
      source: req.body.source || 'website',
      isGuest: req.body.isGuest !== undefined ? req.body.isGuest : true,
      lastActivity: 'Just now'
    });
    
    const savedLead = await newLead.save();
    console.log('Lead created successfully with ID:', savedLead._id);
    res.status(201).json(savedLead);
  } catch (error) {
    console.error('Error creating lead:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update a lead
router.patch('/:id', async (req, res) => {
  try {
    console.log(`Updating lead with ID ${req.params.id}...`);
    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.id,
      { ...req.body, lastActivity: 'Just now' },
      { new: true }
    );
    
    if (!updatedLead) {
      console.log(`Lead with ID ${req.params.id} not found for update`);
      return res.status(404).json({ message: 'Lead not found' });
    }
    
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
    
    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.id,
      { status, lastActivity: 'Just now' },
      { new: true }
    );
    
    if (!updatedLead) {
      console.log(`Lead with ID ${req.params.id} not found for status update`);
      return res.status(404).json({ message: 'Lead not found' });
    }
    
    console.log(`Status for lead with ID ${req.params.id} updated successfully to ${status}`);
    res.json(updatedLead);
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
    
    const lead = await Lead.findById(req.params.id);
    
    if (!lead) {
      console.log(`Lead with ID ${req.params.id} not found for adding interaction`);
      return res.status(404).json({ message: 'Lead not found' });
    }
    
    // Add the new interaction
    const interaction = {
      message,
      date: new Date()
    };
    
    lead.interactionsData = lead.interactionsData || [];
    lead.interactionsData.push(interaction);
    lead.interactions = lead.interactionsData.length;
    lead.lastActivity = 'Just now';
    
    const updatedLead = await lead.save();
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
    const deletedLead = await Lead.findByIdAndDelete(req.params.id);
    
    if (!deletedLead) {
      console.log(`Lead with ID ${req.params.id} not found for deletion`);
      return res.status(404).json({ message: 'Lead not found' });
    }
    
    console.log(`Lead with ID ${req.params.id} deleted successfully`);
    res.json({ message: 'Lead deleted' });
  } catch (error) {
    console.error(`Error deleting lead with ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
