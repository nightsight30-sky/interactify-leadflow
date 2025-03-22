
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
    console.log('Fetching team members...');
    // Generate team members based on actual leads in the system
    const emailCounts = {};
    
    // Count leads per email
    store.leads.forEach(lead => {
      if (!lead.isGuest && lead.email) {
        emailCounts[lead.email] = (emailCounts[lead.email] || 0) + 1;
      }
    });
    
    // Create team members from the email counts
    const team = Object.entries(emailCounts).map(([email, count], index) => {
      // Extract name from email if available, otherwise use a default name
      const nameFromEmail = email.split('@')[0] || `Team Member ${index + 1}`;
      const name = nameFromEmail.split('.').map(part => 
        part.charAt(0).toUpperCase() + part.slice(1)
      ).join(' ');
      
      return {
        id: index + 1,
        name,
        role: index === 0 ? 'Admin' : index === 1 ? 'Sales Manager' : 'Lead Qualifier',
        email,
        leads: count
      };
    });
    
    // If no team members generated, provide some defaults
    if (team.length === 0) {
      team.push(
        { id: 1, name: 'John Doe', role: 'Admin', email: 'john@example.com', leads: 0 },
        { id: 2, name: 'Jane Smith', role: 'Sales Manager', email: 'jane@example.com', leads: 0 }
      );
    }
    
    console.log('Team members fetched:', team);
    res.json(team);
  } catch (error) {
    console.error('Error fetching team members:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get calendar events
router.get('/calendar', async (req, res) => {
  try {
    console.log('Fetching calendar events...');
    // Generate calendar events based on actual leads in the system
    const events = [];
    const today = new Date();
    
    // Create events for each lead with recent activity
    store.leads.forEach((lead, index) => {
      if (lead.status === 'contacted' || lead.status === 'qualified') {
        // Create a follow-up meeting event
        const eventDate = new Date(today);
        eventDate.setDate(today.getDate() + (index % 7) + 1); // Spread events over the next week
        
        events.push({
          id: index + 1,
          title: lead.status === 'contacted' ? 'Initial Call' : 'Product Demo',
          date: eventDate.toISOString(),
          type: lead.status === 'contacted' ? 'call' : 'demo',
          leadId: lead.id
        });
      }
    });
    
    // If no events generated, provide some defaults
    if (events.length === 0 && store.leads.length > 0) {
      events.push(
        { 
          id: 1, 
          title: 'Client Meeting', 
          date: new Date(today.setDate(today.getDate() + 1)).toISOString(),
          type: 'meeting',
          leadId: store.leads[0].id
        }
      );
    } else if (events.length === 0) {
      events.push(
        { 
          id: 1, 
          title: 'Client Meeting', 
          date: new Date(today.setDate(today.getDate() + 1)).toISOString(),
          type: 'meeting',
          leadId: '1'
        }
      );
    }
    
    console.log('Calendar events fetched:', events);
    res.json(events);
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
