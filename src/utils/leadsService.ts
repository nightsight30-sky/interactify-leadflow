
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
};
