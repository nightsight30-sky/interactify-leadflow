
import axios from 'axios';

// Define TypeScript types
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
export type LeadSource = 'website' | 'referral' | 'social' | 'email' | 'phone' | 'other';

export interface Lead {
  id: string;
  name: string;
  email: string;
  requestType: string;
  message: string;
  status: LeadStatus;
  source: LeadSource;
  score: number;
  interactions: number;
  lastActivity: string;
  isGuest?: boolean;
  createdAt?: Date;
  analysis?: string;
  interactionsData?: Array<{ message: string; date: Date }>;
}

export interface LeadFormData {
  name: string;
  email: string;
  requestType: string;
  message: string;
  status?: LeadStatus;
  source?: LeadSource;
  score?: number;
  interactions?: number;
  lastActivity?: string;
  isGuest?: boolean;
}

// Add TeamMember and CalendarEvent types
export interface TeamMember {
  id: number;
  name: string;
  role: string;
  email: string;
  leads: number;
}

export interface CalendarEvent {
  id: number;
  title: string;
  date: string;
  type: string;
  leadId: string;
}

// Utility function to check if there's an error in the API response
const checkForError = (response: any) => {
  if (response && response.error) {
    console.error('API Error:', response.error);
    throw new Error(response.error);
  }
  return response;
};

// Define the leads service
export const leadsService = {
  // Get all leads
  getLeads: async (): Promise<Lead[]> => {
    try {
      console.log('Fetching all leads...');
      const response = await axios.get('/api/leads');
      return response.data;
    } catch (error) {
      console.error('Error fetching leads:', error);
      throw error;
    }
  },

  // Get lead by ID
  getLead: async (id: string): Promise<Lead> => {
    try {
      console.log(`Fetching lead with ID: ${id}`);
      const response = await axios.get(`/api/leads/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching lead ${id}:`, error);
      throw error;
    }
  },

  // Get leads for a specific user
  getUserLeads: async (email: string): Promise<Lead[]> => {
    try {
      console.log(`Fetching leads for user: ${email}`);
      const response = await axios.get(`/api/leads/user/${email}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user leads for ${email}:`, error);
      throw error;
    }
  },

  // Get guest leads (leads from non-registered users)
  getGuestLeads: async (): Promise<Lead[]> => {
    try {
      console.log('Fetching guest leads...');
      const response = await axios.get('/api/leads/guests');
      return response.data;
    } catch (error) {
      console.error('Error fetching guest leads:', error);
      throw error;
    }
  },

  // Get registered (non-guest) leads
  getRegisteredUserLeads: async (): Promise<Lead[]> => {
    try {
      console.log('Fetching registered user leads...');
      const response = await axios.get('/api/leads/registered');
      return response.data;
    } catch (error) {
      console.error('Error fetching registered user leads:', error);
      throw error;
    }
  },

  // Add a new lead
  addLead: async (lead: LeadFormData): Promise<Lead> => {
    try {
      console.log('Adding new lead:', lead);
      const response = await axios.post('/api/leads', lead);
      return response.data;
    } catch (error) {
      console.error('Error adding lead:', error);
      throw error;
    }
  },

  // Update a lead
  updateLead: async (id: string, leadData: Partial<Lead>): Promise<Lead> => {
    try {
      console.log(`Updating lead ${id}:`, leadData);
      const response = await axios.patch(`/api/leads/${id}`, leadData);
      return response.data;
    } catch (error) {
      console.error(`Error updating lead ${id}:`, error);
      throw error;
    }
  },

  // Update lead status (shorthand for common operation)
  updateLeadStatus: async (id: string, status: LeadStatus): Promise<Lead> => {
    try {
      console.log(`Updating lead ${id} status to ${status}`);
      const response = await axios.patch(`/api/leads/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error(`Error updating lead status ${id}:`, error);
      throw error;
    }
  },

  // Add an interaction to a lead
  addInteraction: async (id: string, message: string): Promise<Lead> => {
    try {
      console.log(`Adding interaction to lead ${id}`);
      const response = await axios.post(`/api/leads/${id}/interactions`, { message });
      return response.data;
    } catch (error) {
      console.error(`Error adding interaction to lead ${id}:`, error);
      throw error;
    }
  },

  // Delete a lead
  deleteLead: async (id: string): Promise<void> => {
    try {
      console.log(`Deleting lead ${id}`);
      await axios.delete(`/api/leads/${id}`);
    } catch (error) {
      console.error(`Error deleting lead ${id}:`, error);
      throw error;
    }
  },

  // Get team members (for admin dashboard)
  getTeamMembers: async (): Promise<TeamMember[]> => {
    try {
      console.log('Fetching team members...');
      const response = await axios.get('/api/admin/team');
      return response.data;
    } catch (error) {
      console.error('Error fetching team members:', error);
      throw error;
    }
  },

  // Get calendar events (for admin dashboard)
  getCalendarEvents: async (): Promise<CalendarEvent[]> => {
    try {
      console.log('Fetching calendar events...');
      const response = await axios.get('/api/admin/calendar');
      return response.data;
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      throw error;
    }
  },
  
  // Get stats for admin dashboard
  getAdminStats: async () => {
    try {
      console.log('Fetching admin stats...');
      const response = await axios.get('/api/admin/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      throw error;
    }
  }
};
