
// Simulated delay function
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Types
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';

export interface Lead {
  id: string;
  name: string;
  email: string;
  requestType: string;
  message: string;
  status: LeadStatus;
  lastActivity: string;
  score: number;
  assignedTo?: string;
  createdBy?: string;
  createdById?: string;
  isGuest: boolean;
  interactions: number;
  notes?: string[];
  createdAt: Date;
}

// Sample data
let leads: Lead[] = [
  {
    id: 'lead-001',
    name: 'John Doe',
    email: 'john@example.com',
    requestType: 'Demo Request',
    message: 'I would like to see a demo of your product.',
    status: 'new',
    lastActivity: '2 days ago',
    score: 75,
    assignedTo: 'Emily Johnson',
    isGuest: false,
    interactions: 0,
    createdAt: new Date('2024-03-01')
  },
  {
    id: 'lead-002',
    name: 'Alice Smith',
    email: 'alice@example.com',
    requestType: 'Pricing',
    message: 'Can you provide more information about your pricing?',
    status: 'contacted',
    lastActivity: '1 week ago',
    score: 60,
    assignedTo: 'Mike Wilson',
    isGuest: false,
    interactions: 2,
    notes: ['Sent follow-up email', 'Scheduled a call'],
    createdAt: new Date('2024-03-10')
  },
  {
    id: 'lead-003',
    name: 'Robert Johnson',
    email: 'robert@example.com',
    requestType: 'Support',
    message: 'I need help with setting up the software.',
    status: 'qualified',
    lastActivity: '3 days ago',
    score: 85,
    assignedTo: 'Sarah Brown',
    isGuest: true,
    interactions: 4,
    notes: ['Provided setup guide', 'Requested more information'],
    createdAt: new Date('2024-03-15')
  },
  {
    id: 'lead-004',
    name: 'Emma Davis',
    email: 'emma@example.com',
    requestType: 'Partnership',
    message: 'We are interested in exploring partnership opportunities.',
    status: 'converted',
    lastActivity: '5 days ago',
    score: 95,
    assignedTo: 'Emily Johnson',
    isGuest: false,
    interactions: 8,
    notes: ['Meeting scheduled for next week', 'Sent partnership details'],
    createdAt: new Date('2024-03-05')
  },
  {
    id: 'lead-005',
    name: 'Daniel Wilson',
    email: 'daniel@example.com',
    requestType: 'Product Inquiry',
    message: 'I want to know more about your product features.',
    status: 'lost',
    lastActivity: '2 weeks ago',
    score: 40,
    assignedTo: 'Mike Wilson',
    isGuest: true,
    interactions: 3,
    notes: ['No response to follow-up calls', 'Chose competitor product'],
    createdAt: new Date('2024-02-20')
  }
];

// Generate a unique ID
const generateUniqueId = (email: string = '') => {
  const timestamp = Date.now().toString();
  const randomPart = Math.random().toString(36).substring(2, 8);
  const userPart = email ? email.split('@')[0].substring(0, 5) : '';
  return `lead-${userPart}-${randomPart}-${timestamp.substring(timestamp.length - 4)}`;
};

// Format the date
const formatDate = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours === 0) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      if (diffMinutes < 5) return 'Just now';
      return `${diffMinutes} minutes ago`;
    }
    return `${diffHours} hours ago`;
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  } else {
    return date.toLocaleDateString();
  }
};

// Simulated leads service
export const leadsService = {
  // Get all leads
  getLeads: async (): Promise<Lead[]> => {
    await delay(800);
    // Sort leads by date, newest first
    return [...leads].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  },
  
  // Get a specific lead by ID
  getLead: async (id: string): Promise<Lead | undefined> => {
    await delay(300);
    return leads.find(lead => lead.id === id);
  },
  
  // Get leads for a specific user by email
  getUserLeads: async (email: string): Promise<Lead[]> => {
    await delay(600);
    // Return leads that match the user's email (either they created it or it was assigned to them)
    return leads.filter(lead => 
      (lead.email === email && lead.isGuest === false) || 
      (lead.createdById === email)
    );
  },

  // Get guest leads (for admin dashboard)
  getGuestLeads: async (): Promise<Lead[]> => {
    await delay(600);
    return leads.filter(lead => lead.isGuest === true);
  },
  
  // Get unassigned leads
  getUnassignedLeads: async (): Promise<Lead[]> => {
    await delay(600);
    return leads.filter(lead => !lead.assignedTo);
  },
  
  // Get leads assigned to a specific team member
  getLeadsForTeamMember: async (teamMemberId: string): Promise<Lead[]> => {
    await delay(600);
    return leads.filter(lead => lead.assignedTo === teamMemberId);
  },
  
  // Add a new lead
  addLead: async (lead: Omit<Lead, 'id' | 'lastActivity' | 'score' | 'interactions' | 'createdAt'>, isGuest: boolean = true): Promise<Lead> => {
    await delay(500);
    
    const id = generateUniqueId(lead.email);
    const currentDate = new Date();
    const formattedDate = formatDate(currentDate);
    
    // Calculate an initial lead score based on request type and being a registered user
    let score = isGuest ? 30 : 60;
    if (lead.requestType === 'Demo Request') score += 15;
    if (lead.requestType === 'Partnership') score += 20;
    if (lead.requestType === 'Pricing') score += 15;
    if (lead.requestType === 'Product Inquiry') score += 10;
    score = Math.min(score, 99); // Cap at 99
    
    // Ensure the name is properly set
    const newLead: Lead = {
      id,
      ...lead,
      name: lead.name || "Unknown User", // Ensure we have a name
      lastActivity: formattedDate,
      score,
      interactions: 0,
      isGuest,
      createdAt: currentDate,
      createdById: lead.email // Store the creator's email for filtering
    };
    
    leads.push(newLead);
    return newLead;
  },
  
  // Update a lead's status
  updateLeadStatus: async (id: string, status: LeadStatus): Promise<Lead | undefined> => {
    await delay(500);
    
    const leadIndex = leads.findIndex(lead => lead.id === id);
    if (leadIndex === -1) return undefined;
    
    const updatedLead = {
      ...leads[leadIndex],
      status,
      lastActivity: 'Just now'
    };
    
    leads[leadIndex] = updatedLead;
    return updatedLead;
  },
  
  // Assign a lead to a team member
  assignLead: async (id: string, assignedTo: string): Promise<Lead | undefined> => {
    await delay(500);
    
    const leadIndex = leads.findIndex(lead => lead.id === id);
    if (leadIndex === -1) return undefined;
    
    const updatedLead = {
      ...leads[leadIndex],
      assignedTo,
      lastActivity: 'Just now'
    };
    
    leads[leadIndex] = updatedLead;
    return updatedLead;
  },
  
  // Assign lead to team member (this was missing)
  assignLeadToTeamMember: async (id: string, teamMemberId: string): Promise<Lead | undefined> => {
    await delay(500);
    
    const leadIndex = leads.findIndex(lead => lead.id === id);
    if (leadIndex === -1) return undefined;
    
    const updatedLead = {
      ...leads[leadIndex],
      assignedTo: teamMemberId,
      lastActivity: 'Just now'
    };
    
    leads[leadIndex] = updatedLead;
    return updatedLead;
  },
  
  // Delete a lead
  deleteLead: async (id: string): Promise<boolean> => {
    await delay(500);
    
    const initialLength = leads.length;
    leads = leads.filter(lead => lead.id !== id);
    return initialLength > leads.length;
  },
  
  // Add an interaction to a lead
  addInteraction: async (id: string, message: string): Promise<Lead | undefined> => {
    await delay(500);
    
    const leadIndex = leads.findIndex(lead => lead.id === id);
    if (leadIndex === -1) return undefined;
    
    // Create a copy of the lead and update
    const updatedLead = {
      ...leads[leadIndex],
      interactions: leads[leadIndex].interactions + 1,
      lastActivity: 'Just now',
      notes: [
        ...(leads[leadIndex].notes || []),
        message
      ]
    };
    
    leads[leadIndex] = updatedLead;
    return updatedLead;
  }
};
