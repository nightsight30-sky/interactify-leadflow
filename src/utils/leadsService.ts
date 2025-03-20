
import axios from 'axios';

const API_URL = '/api/leads';

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
export type LeadSource = 'website' | 'referral' | 'social' | 'email' | 'other';

export interface Lead {
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: LeadStatus;
  source: LeadSource;
  score: number;
  interactions?: {
    message: string;
    date: Date;
  }[];
  createdAt?: Date;
}

export const leadsService = {
  // Get all leads
  async getLeads(): Promise<Lead[]> {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching leads:', error);
      return [];
    }
  },

  // Get a single lead
  async getLead(leadId: string): Promise<Lead | null> {
    try {
      const response = await axios.get(`${API_URL}/${leadId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching lead ${leadId}:`, error);
      return null;
    }
  },

  // Create a new lead
  async createLead(lead: Omit<Lead, '_id'>): Promise<Lead | null> {
    try {
      const response = await axios.post(API_URL, lead);
      return response.data;
    } catch (error) {
      console.error('Error creating lead:', error);
      return null;
    }
  },

  // Update a lead
  async updateLead(leadId: string, lead: Partial<Lead>): Promise<Lead | null> {
    try {
      const response = await axios.patch(`${API_URL}/${leadId}`, lead);
      return response.data;
    } catch (error) {
      console.error(`Error updating lead ${leadId}:`, error);
      return null;
    }
  },

  // Update lead status
  async updateLeadStatus(leadId: string, status: LeadStatus): Promise<Lead | null> {
    try {
      const response = await axios.patch(`${API_URL}/${leadId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error(`Error updating status for lead ${leadId}:`, error);
      return null;
    }
  },

  // Add an interaction to a lead
  async addInteraction(leadId: string, message: string): Promise<Lead | null> {
    try {
      const response = await axios.post(`${API_URL}/${leadId}/interactions`, { message });
      return response.data;
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
