
import axios from 'axios';

const API_URL = '/api/leads';

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
export type LeadSource = 'website' | 'referral' | 'social' | 'email' | 'other';

export interface Lead {
  _id?: string;
  id?: string; // Frontend uses id rather than _id
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: LeadStatus;
  source: LeadSource;
  score: number;
  message?: string; // Message content
  requestType?: string; // Type of request
  lastActivity?: string; // Last activity timestamp or description
  interactions: number; // Changed from array to number for display purposes
  interactionsData?: { // Detailed interaction data
    message: string;
    date: Date;
  }[];
  isGuest?: boolean; // Whether the lead is a guest or registered user
  analysis?: string; // AI analysis of the lead
  createdAt?: Date;
}

export const leadsService = {
  // Get all leads
  async getLeads(): Promise<Lead[]> {
    try {
      const response = await axios.get(API_URL);
      // Map backend _id to id for frontend compatibility
      return response.data.map((lead: any) => ({
        ...lead,
        id: lead._id
      }));
    } catch (error) {
      console.error('Error fetching leads:', error);
      return [];
    }
  },

  // Get guest leads
  async getGuestLeads(): Promise<Lead[]> {
    try {
      const response = await axios.get(`${API_URL}/guests`);
      return response.data.map((lead: any) => ({
        ...lead,
        id: lead._id,
        isGuest: true
      }));
    } catch (error) {
      console.error('Error fetching guest leads:', error);
      return [];
    }
  },

  // Get registered user leads
  async getRegisteredUserLeads(): Promise<Lead[]> {
    try {
      const response = await axios.get(`${API_URL}/registered`);
      return response.data.map((lead: any) => ({
        ...lead,
        id: lead._id,
        isGuest: false
      }));
    } catch (error) {
      console.error('Error fetching registered user leads:', error);
      return [];
    }
  },

  // Get user leads (for user dashboard)
  async getUserLeads(userId: string): Promise<Lead[]> {
    try {
      const response = await axios.get(`${API_URL}/user/${userId}`);
      return response.data.map((lead: any) => ({
        ...lead,
        id: lead._id
      }));
    } catch (error) {
      console.error(`Error fetching leads for user ${userId}:`, error);
      return [];
    }
  },

  // Get a single lead
  async getLead(leadId: string): Promise<Lead | null> {
    try {
      const response = await axios.get(`${API_URL}/${leadId}`);
      return {
        ...response.data,
        id: response.data._id
      };
    } catch (error) {
      console.error(`Error fetching lead ${leadId}:`, error);
      return null;
    }
  },

  // Create a new lead
  async createLead(lead: Omit<Lead, '_id' | 'id'>): Promise<Lead | null> {
    try {
      const response = await axios.post(API_URL, lead);
      return {
        ...response.data,
        id: response.data._id
      };
    } catch (error) {
      console.error('Error creating lead:', error);
      return null;
    }
  },

  // Add a new lead (alias for createLead with isGuest parameter support)
  async addLead(lead: Omit<Lead, '_id' | 'id'>, isGuest: boolean = true): Promise<Lead | null> {
    try {
      const leadWithGuestFlag = { ...lead, isGuest };
      return this.createLead(leadWithGuestFlag);
    } catch (error) {
      console.error('Error adding lead:', error);
      return null;
    }
  },

  // Update a lead
  async updateLead(leadId: string, lead: Partial<Lead>): Promise<Lead | null> {
    try {
      const response = await axios.patch(`${API_URL}/${leadId}`, lead);
      return {
        ...response.data,
        id: response.data._id
      };
    } catch (error) {
      console.error(`Error updating lead ${leadId}:`, error);
      return null;
    }
  },

  // Update lead status
  async updateLeadStatus(leadId: string, status: LeadStatus): Promise<Lead | null> {
    try {
      const response = await axios.patch(`${API_URL}/${leadId}/status`, { status });
      return {
        ...response.data,
        id: response.data._id
      };
    } catch (error) {
      console.error(`Error updating status for lead ${leadId}:`, error);
      return null;
    }
  },

  // Add an interaction to a lead
  async addInteraction(leadId: string, message: string): Promise<Lead | null> {
    try {
      const response = await axios.post(`${API_URL}/${leadId}/interactions`, { message });
      return {
        ...response.data,
        id: response.data._id
      };
    } catch (error) {
      console.error(`Error adding interaction to lead ${leadId}:`, error);
      return null;
    }
  },

  // Delete a lead
  async deleteLead(leadId: string): Promise<boolean> {
    try {
      await axios.delete(`${API_URL}/${leadId}`);
      return true;
    } catch (error) {
      console.error(`Error deleting lead ${leadId}:`, error);
      return false;
    }
  }
};

export default leadsService;
