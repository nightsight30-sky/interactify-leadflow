
import { toast } from "sonner";

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
export type LeadSource = 'registered' | 'guest';

export interface Lead {
  id: string;
  name: string;
  email: string;
  score: number;
  status: LeadStatus;
  lastActivity: string;
  requestType: string;
  message: string;
  interactions: number;
  source: LeadSource;
  userId?: string;
  createdAt: string;
}

export interface EmailData {
  to: string;
  subject: string;
  message: string;
}

// Initial mock data
const initialLeads: Lead[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    score: 85,
    status: 'qualified',
    lastActivity: '2 days ago',
    requestType: 'Product Inquiry',
    message: 'I\'m interested in your AI lead scoring system. Can you tell me more about the pricing?',
    interactions: 8,
    source: 'registered',
    userId: 'user1',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    name: 'Emily Johnson',
    email: 'emily@example.com',
    score: 72,
    status: 'contacted',
    lastActivity: '5 days ago',
    requestType: 'Demo Request',
    message: 'We\'re looking for a lead management system for our sales team of 15 people. Would like to see how your platform works.',
    interactions: 3,
    source: 'registered',
    userId: 'user2',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'michael@example.com',
    score: 45,
    status: 'new',
    lastActivity: '1 week ago',
    requestType: 'Support',
    message: 'Having some questions about the WhatsApp integration. How does it work with our existing system?',
    interactions: 1,
    source: 'guest',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    score: 92,
    status: 'qualified',
    lastActivity: '1 day ago',
    requestType: 'Demo Request',
    message: 'Our marketing team is looking for a new lead management solution that integrates with our CRM. Would like to see a demo.',
    interactions: 5,
    source: 'registered',
    userId: 'user1',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '5',
    name: 'David Lee',
    email: 'david@example.com',
    score: 31,
    status: 'new',
    lastActivity: '3 days ago',
    requestType: 'Pricing',
    message: 'How much does your basic plan cost? We\'re a small business with about 5 sales reps.',
    interactions: 2,
    source: 'guest',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '6',
    name: 'Jessica Chen',
    email: 'jessica@example.com',
    score: 78,
    status: 'contacted',
    lastActivity: '4 days ago',
    requestType: 'Product Inquiry',
    message: 'Does your platform integrate with Salesforce? We need a solution that works with our existing tech stack.',
    interactions: 4,
    source: 'guest',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  },
];

// Mock user data
const users = {
  'user1': { id: 'user1', name: 'John Doe', email: 'john.doe@example.com' },
  'user2': { id: 'user2', name: 'Jane Smith', email: 'jane.smith@example.com' }
};

// Use localStorage to persist leads data
const getStoredLeads = (): Lead[] => {
  const storedLeads = localStorage.getItem('leadflow_leads');
  if (storedLeads) {
    try {
      return JSON.parse(storedLeads);
    } catch (error) {
      console.error('Error parsing stored leads:', error);
      return [...initialLeads];
    }
  }
  return [...initialLeads];
};

// Save leads to localStorage
const saveLeads = (leads: Lead[]) => {
  localStorage.setItem('leadflow_leads', JSON.stringify(leads));
};

// Get current user from localStorage
const getCurrentUser = () => {
  const userJson = localStorage.getItem('leadflow_current_user');
  if (userJson) {
    try {
      return JSON.parse(userJson);
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }
  return null;
};

// Save current user to localStorage
const saveCurrentUser = (user: any) => {
  localStorage.setItem('leadflow_current_user', JSON.stringify(user));
};

// Initialize with stored or initial data
let leads = getStoredLeads();

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Calculate AI score based on message content and request type
const calculateScore = (lead: Partial<Lead>): number => {
  let score = Math.floor(Math.random() * 40) + 30; // Base score 30-70
  
  if (lead.message) {
    // Longer messages typically indicate higher interest
    if (lead.message.length > 100) score += 15;
    
    // Keywords analysis
    const keywords = ['urgent', 'interested', 'buy', 'purchase', 'demo', 'pricing', 'soon', 'immediately'];
    keywords.forEach(keyword => {
      if (lead.message?.toLowerCase().includes(keyword)) score += 5;
    });
  }
  
  // Request type scoring
  if (lead.requestType === 'Demo Request') score += 20;
  if (lead.requestType === 'Product Inquiry') score += 10;
  if (lead.requestType === 'Pricing') score += 15;
  
  // Cap at 99
  return Math.min(score, 99);
};

// API simulation functions
export const leadsService = {
  // Get all leads
  getLeads: async (): Promise<Lead[]> => {
    await delay(600); // Simulate network delay
    return [...leads];
  },
  
  // Get leads for current user
  getUserLeads: async (userId: string): Promise<Lead[]> => {
    await delay(600);
    return leads.filter(lead => lead.userId === userId);
  },
  
  // Get leads by source
  getLeadsBySource: async (source: LeadSource): Promise<Lead[]> => {
    await delay(600);
    return leads.filter(lead => lead.source === source);
  },

  // Get lead by ID
  getLead: async (id: string): Promise<Lead | undefined> => {
    await delay(300);
    return leads.find(lead => lead.id === id);
  },

  // Update lead status
  updateLeadStatus: async (id: string, status: LeadStatus): Promise<Lead | undefined> => {
    await delay(500);
    const index = leads.findIndex(lead => lead.id === id);
    if (index !== -1) {
      leads[index] = { 
        ...leads[index], 
        status,
        lastActivity: 'Just now'
      };
      saveLeads(leads);
      toast.success("Lead status updated successfully");
      return leads[index];
    }
    toast.error("Failed to update lead status");
    return undefined;
  },

  // Add a new lead
  addLead: async (lead: Omit<Lead, 'id' | 'score' | 'lastActivity' | 'interactions' | 'source' | 'createdAt'>): Promise<Lead> => {
    await delay(800);
    
    // Generate random ID
    const id = Math.random().toString(36).substring(2, 9);
    
    // Get current user if available
    const currentUser = getCurrentUser();
    
    // Calculate score
    const score = calculateScore(lead);
    
    const newLead: Lead = {
      id,
      ...lead,
      score,
      lastActivity: 'Just now',
      interactions: 1,
      source: currentUser ? 'registered' : 'guest',
      userId: currentUser?.id,
      createdAt: new Date().toISOString()
    };
    
    leads = [newLead, ...leads];
    saveLeads(leads);
    toast.success("New lead added successfully");
    return newLead;
  },

  // Add interaction to a lead
  addInteraction: async (id: string, message: string): Promise<Lead | undefined> => {
    await delay(400);
    const index = leads.findIndex(lead => lead.id === id);
    if (index !== -1) {
      leads[index] = { 
        ...leads[index], 
        interactions: leads[index].interactions + 1,
        lastActivity: 'Just now'
      };
      saveLeads(leads);
      toast.success("Interaction recorded");
      return leads[index];
    }
    toast.error("Failed to record interaction");
    return undefined;
  },

  // Send email
  sendEmail: async (data: EmailData): Promise<boolean> => {
    await delay(700);
    console.log('Sending email:', data);
    
    // Simulate email success rate (90% success)
    const success = Math.random() > 0.1;
    
    if (success) {
      return true;
    } else {
      toast.error("Failed to send email");
      throw new Error("Email sending failed");
    }
  },

  // Delete a lead
  deleteLead: async (id: string): Promise<boolean> => {
    await delay(500);
    const initialLength = leads.length;
    leads = leads.filter(lead => lead.id !== id);
    if (leads.length < initialLength) {
      saveLeads(leads);
      toast.success("Lead deleted successfully");
      return true;
    }
    toast.error("Failed to delete lead");
    return false;
  },
  
  // Auth functions
  login: async (email: string, password: string): Promise<any> => {
    await delay(1000);
    
    // Extremely simplified mock authentication
    // In a real app, this would validate against a backend
    const isAdmin = email.includes('admin');
    
    if (email && password.length >= 6) {
      const user = {
        id: isAdmin ? 'admin1' : 'user1',
        name: isAdmin ? 'Admin User' : 'John Doe',
        email,
        role: isAdmin ? 'admin' : 'user'
      };
      
      saveCurrentUser(user);
      return user;
    }
    
    throw new Error('Invalid credentials');
  },
  
  register: async (name: string, email: string, password: string): Promise<any> => {
    await delay(1200);
    
    // Simplified mock registration
    if (name && email && password.length >= 6) {
      const isAdmin = email.includes('admin');
      
      const user = {
        id: `user${Math.random().toString(36).substring(2, 7)}`,
        name,
        email,
        role: isAdmin ? 'admin' : 'user'
      };
      
      saveCurrentUser(user);
      return user;
    }
    
    throw new Error('Invalid registration data');
  },
  
  logout: async (): Promise<void> => {
    await delay(300);
    localStorage.removeItem('leadflow_current_user');
  },
  
  getCurrentUser: (): any => {
    return getCurrentUser();
  },
  
  // Get AI recommendations for lead
  getAIRecommendations: async (leadId: string): Promise<string[]> => {
    await delay(800);
    const lead = leads.find(l => l.id === leadId);
    
    if (!lead) return [];
    
    // Generate recommendations based on lead properties
    const recommendations = [];
    
    if (lead.score > 80) {
      recommendations.push("This lead shows high purchase intent. Consider scheduling a personal call.");
    } else if (lead.score > 60) {
      recommendations.push("This lead shows moderate interest. Send detailed product information.");
    } else {
      recommendations.push("This lead needs nurturing. Include educational content in your follow-up.");
    }
    
    if (lead.requestType === 'Demo Request') {
      recommendations.push("Prepare a personalized demo focusing on their specific needs.");
    } else if (lead.requestType === 'Pricing') {
      recommendations.push("Include a special offer in your next communication.");
    }
    
    if (lead.interactions < 2) {
      recommendations.push("This is a new conversation. Focus on building rapport.");
    } else if (lead.interactions > 5) {
      recommendations.push("This lead has engaged multiple times. Consider offering a free consultation.");
    }
    
    return recommendations;
  }
};
