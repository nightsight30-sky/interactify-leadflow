import axios from 'axios';

const API_URL = '/api/leads';
const ADMIN_API_URL = '/api/admin';

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

export interface AdminStats {
  totalLeads: number;
  newLeads: number;
  contactedLeads: number;
  qualifiedLeads: number;
  convertedLeads: number;
  lostLeads: number;
}

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

// Helper function for error handling
const handleApiError = (error: any, context: string): never => {
  let errorMessage = `Error ${context}`;
  
  if (axios.isAxiosError(error)) {
    console.error(`API Error (${context}):`, error.response?.data || error.message);
    errorMessage = error.response?.data?.message || error.message;
  } else {
    console.error(`Non-Axios Error (${context}):`, error);
    errorMessage = error.message || String(error);
  }
  
  throw new Error(errorMessage);
};

export const leadsService = {
  // Get all leads
  async getLeads(): Promise<Lead[]> {
    try {
      console.log('Fetching all leads...');
      const response = await axios.get(API_URL);
      console.log('Leads fetched successfully:', response.data.length);
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

  // Get admin dashboard stats
  async getAdminStats(): Promise<AdminStats> {
    try {
      console.log('Fetching admin stats...');
      const response = await axios.get(`${ADMIN_API_URL}/stats`);
      console.log('Admin stats fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      return {
        totalLeads: 0,
        newLeads: 0,
        contactedLeads: 0,
        qualifiedLeads: 0,
        convertedLeads: 0,
        lostLeads: 0
      };
    }
  },

  // Get team members
  async getTeamMembers(): Promise<TeamMember[]> {
    try {
      console.log('Fetching team members...');
      const response = await axios.get(`${ADMIN_API_URL}/team`);
      console.log('Team members fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching team members:', error);
      return [];
    }
  },

  // Get calendar events
  async getCalendarEvents(): Promise<CalendarEvent[]> {
    try {
      console.log('Fetching calendar events...');
      const response = await axios.get(`${ADMIN_API_URL}/calendar`);
      console.log('Calendar events fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      return [];
    }
  },

  // Get guest leads
  async getGuestLeads(): Promise<Lead[]> {
    try {
      console.log('Fetching guest leads...');
      const response = await axios.get(`${API_URL}/guests`);
      console.log('Guest leads fetched successfully:', response.data.length);
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
      console.log('Fetching registered user leads...');
      const response = await axios.get(`${API_URL}/registered`);
      console.log('Registered user leads fetched successfully:', response.data.length);
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
      console.log(`Fetching leads for user ${userId}...`);
      const response = await axios.get(`${API_URL}/user/${userId}`);
      console.log(`Leads for user ${userId} fetched successfully:`, response.data.length);
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
      console.log(`Fetching lead ${leadId}...`);
      const response = await axios.get(`${API_URL}/${leadId}`);
      console.log(`Lead ${leadId} fetched successfully`);
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
      console.log('Creating new lead:', lead);
      const response = await axios.post(API_URL, lead);
      console.log('Lead created successfully:', response.data);
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
      console.log('Adding lead with isGuest =', isGuest, ':', lead);
      const leadWithGuestFlag = { ...lead, isGuest };
      const result = await this.createLead(leadWithGuestFlag);
      if (!result) {
        console.error('Failed to create lead, result is null');
      }
      return result;
    } catch (error) {
      console.error('Error adding lead:', error);
      return null;
    }
  },

  // Update a lead
  async updateLead(leadId: string, lead: Partial<Lead>): Promise<Lead | null> {
    try {
      console.log(`Updating lead ${leadId}...`);
      const response = await axios.patch(`${API_URL}/${leadId}`, lead);
      console.log(`Lead ${leadId} updated successfully`);
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
      console.log(`Updating status for lead ${leadId} to ${status}...`);
      const response = await axios.patch(`${API_URL}/${leadId}/status`, { status });
      console.log(`Status for lead ${leadId} updated successfully`);
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
      console.log(`Adding interaction to lead ${leadId}...`);
      const response = await axios.post(`${API_URL}/${leadId}/interactions`, { message });
      console.log(`Interaction added to lead ${leadId} successfully`);
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
      console.log(`Deleting lead ${leadId}...`);
      await axios.delete(`${API_URL}/${leadId}`);
      console.log(`Lead ${leadId} deleted successfully`);
      return true;
    } catch (error) {
      console.error(`Error deleting lead ${leadId}:`, error);
      return false;
    }
  }
};

export default leadsService;
