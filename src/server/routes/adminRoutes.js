
const express = require('express');
const router = express.Router();
const { store } = require('../db');

// Get admin dashboard stats
router.get('/stats', async (req, res) => {
  try {
    console.log('Fetching admin dashboard stats...');
    
    const totalLeads = store.leads.length;
    const newLeads = store.leads.filter(lead => lead.status === 'new').length;
    const contactedLeads = store.leads.filter(lead => lead.status === 'contacted').length;
    const qualifiedLeads = store.leads.filter(lead => lead.status === 'qualified').length;
    const convertedLeads = store.leads.filter(lead => lead.status === 'converted').length;
    const lostLeads = store.leads.filter(lead => lead.status === 'lost').length;
    
    const stats = {
      totalLeads,
      newLeads,
      contactedLeads,
      qualifiedLeads,
      convertedLeads,
      lostLeads
    };
    
    console.log('Admin stats fetched successfully:', stats);
    res.json(stats);
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get team members
router.get('/team', async (req, res) => {
  try {
    // Since we don't have a team model yet, providing some static data
    // In a real application, this would come from the database
    const team = [
      { id: 1, name: 'John Doe', role: 'Admin', email: 'john@example.com', leads: 24 },
      { id: 2, name: 'Jane Smith', role: 'Sales Manager', email: 'jane@example.com', leads: 18 },
      { id: 3, name: 'Mike Johnson', role: 'Lead Qualifier', email: 'mike@example.com', leads: 32 }
    ];
    
    res.json(team);
  } catch (error) {
    console.error('Error fetching team members:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get calendar events
router.get('/calendar', async (req, res) => {
  try {
    // Generate calendar events based on leads with upcoming activities
    // For demo purposes we'll create some sample events
    const today = new Date();
    const events = [
      { 
        id: 1, 
        title: 'Client Meeting', 
        date: new Date(today.setDate(today.getDate() + 1)).toISOString(),
        type: 'meeting',
        leadId: store.leads.length > 0 ? store.leads[0].id : '1'
      },
      { 
        id: 2, 
        title: 'Product Demo', 
        date: new Date(today.setDate(today.getDate() + 3)).toISOString(),
        type: 'demo',
        leadId: store.leads.length > 1 ? store.leads[1].id : '2'
      }
    ];
    
    res.json(events);
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
