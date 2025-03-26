export interface Lead {
  id: number;
  name: string;
  email: string;
  message: string;
  requestType: string;
  status: LeadStatus;
  score: number;
  lastActivity: string;
  type: 'guest' | 'registered';
  userId?: string;
  businessId?: string;
  teamId?: string;
  assignedTo?: string;
}

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';

const mockLeads: Lead[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    message: 'Interested in learning more about your services.',
    requestType: 'Information Request',
    status: 'new',
    score: 65,
    lastActivity: '2 days ago',
    type: 'guest',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    message: 'Looking for a solution to improve lead conversion rates.',
    requestType: 'Demo Request',
    status: 'contacted',
    score: 80,
    lastActivity: '1 day ago',
    type: 'registered',
    userId: '456',
  },
  {
    id: 3,
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    message: 'Can you provide a case study for the real estate industry?',
    requestType: 'Case Study Request',
    status: 'qualified',
    score: 70,
    lastActivity: '5 hours ago',
    type: 'guest',
  },
  {
    id: 4,
    name: 'Bob Williams',
    email: 'bob.williams@example.com',
    message: 'What are the key features of your lead management platform?',
    requestType: 'Feature Inquiry',
    status: 'converted',
    score: 90,
    lastActivity: 'Just now',
    type: 'registered',
    userId: '789',
  },
  {
    id: 5,
    name: 'Charlie Brown',
    email: 'charlie.brown@example.com',
    message: 'Not interested at the moment.',
    requestType: 'Opt-Out',
    status: 'lost',
    score: 20,
    lastActivity: '1 week ago',
    type: 'guest',
  },
  {
    id: 6,
    name: 'Diana Miller',
    email: 'diana.miller@example.com',
    message: 'Requesting a follow-up call to discuss pricing options.',
    requestType: 'Pricing Inquiry',
    status: 'new',
    score: 75,
    lastActivity: '3 days ago',
    type: 'registered',
    userId: '101',
  },
  {
    id: 7,
    name: 'Eva Davis',
    email: 'eva.davis@example.com',
    message: 'Seeking a solution tailored to the healthcare industry.',
    requestType: 'Custom Solution Request',
    status: 'contacted',
    score: 85,
    lastActivity: '2 days ago',
    type: 'guest',
  },
  {
    id: 8,
    name: 'Frank White',
    email: 'frank.white@example.com',
    message: 'Interested in a long-term partnership.',
    requestType: 'Partnership Inquiry',
    status: 'qualified',
    score: 78,
    lastActivity: '1 day ago',
    type: 'registered',
    userId: '112',
  },
  {
    id: 9,
    name: 'Grace Taylor',
    email: 'grace.taylor@example.com',
    message: 'Signed up for the premium plan.',
    requestType: 'Subscription Confirmation',
    status: 'converted',
    score: 95,
    lastActivity: 'Just now',
    type: 'guest',
  },
  {
    id: 10,
    name: 'Henry Moore',
    email: 'henry.moore@example.com',
    message: 'Decided to go with a competitor.',
    requestType: 'Competitor Choice',
    status: 'lost',
    score: 15,
    lastActivity: '2 weeks ago',
    type: 'registered',
    userId: '131',
  },
  {
    id: 11,
    name: 'Ivy Clark',
    email: 'ivy.clark@example.com',
    message: 'Requesting a product demonstration.',
    requestType: 'Demo Request',
    status: 'new',
    score: 72,
    lastActivity: '4 days ago',
    type: 'guest',
    businessId: 'b123',
  },
  {
    id: 12,
    name: 'Jack Green',
    email: 'jack.green@example.com',
    message: 'Inquiring about enterprise solutions.',
    requestType: 'Enterprise Inquiry',
    status: 'contacted',
    score: 82,
    lastActivity: '3 days ago',
    type: 'registered',
    userId: '141',
    businessId: 'b123',
  },
  {
    id: 13,
    name: 'Kelly Hill',
    email: 'kelly.hill@example.com',
    message: 'Interested in a custom integration.',
    requestType: 'Integration Request',
    status: 'qualified',
    score: 76,
    lastActivity: '2 days ago',
    type: 'guest',
    teamId: 't123',
  },
  {
    id: 14,
    name: 'Liam Baker',
    email: 'liam.baker@example.com',
    message: 'Signed up for a trial account.',
    requestType: 'Trial Signup',
    status: 'converted',
    score: 92,
    lastActivity: 'Just now',
    type: 'registered',
    userId: '151',
    teamId: 't123',
  },
  {
    id: 15,
    name: 'Mia Young',
    email: 'mia.young@example.com',
    message: 'No longer interested in our services.',
    requestType: 'Service Cancellation',
    status: 'lost',
    score: 18,
    lastActivity: '3 weeks ago',
    type: 'guest',
  },
];

// Add these methods to the leadsService object:
export const leadsService = {
  getLeads: () => {
    // Simulate API call with a delay
    return new Promise<Lead[]>((resolve) => {
      setTimeout(() => {
        resolve(mockLeads);
      }, 800);
    });
  },
  
  getGuestLeads: () => {
    // Simulate API call with a delay - filter for guest leads
    return new Promise<Lead[]>((resolve) => {
      setTimeout(() => {
        const guestLeads = mockLeads.filter(lead => lead.type === 'guest');
        resolve(guestLeads);
      }, 800);
    });
  },
  
  getRegisteredUserLeads: () => {
    // Simulate API call with a delay - filter for registered user leads
    return new Promise<Lead[]>((resolve) => {
      setTimeout(() => {
        const userLeads = mockLeads.filter(lead => lead.type === 'registered');
        resolve(userLeads);
      }, 800);
    });
  },
  
  getLeadsForUser: (userId: string = '123') => {
    // Simulate API call with a delay - filter for specific user
    return new Promise<Lead[]>((resolve) => {
      setTimeout(() => {
        const userLeads = mockLeads.filter(lead => 
          lead.userId === userId || lead.assignedTo === userId
        );
        resolve(userLeads);
      }, 800);
    });
  },
  
  getLeadsForBusiness: (businessId: string = 'b123') => {
    // Simulate API call with a delay - filter for business
    return new Promise<Lead[]>((resolve) => {
      setTimeout(() => {
        const businessLeads = mockLeads.filter(lead => 
          lead.businessId === businessId
        );
        resolve(businessLeads);
      }, 800);
    });
  },
  
  getLeadsForTeam: (teamId: string = 't123') => {
    // Simulate API call with a delay - filter for team
    return new Promise<Lead[]>((resolve) => {
      setTimeout(() => {
        const teamLeads = mockLeads.filter(lead => 
          lead.teamId === teamId
        );
        resolve(teamLeads);
      }, 800);
    });
  },
  
  updateLeadStatus: (leadId: number, status: LeadStatus) => {
    // Simulate API call with a delay
    return new Promise<Lead>((resolve) => {
      setTimeout(() => {
        const lead = mockLeads.find(l => l.id === leadId);
        if (lead) {
          lead.status = status;
          lead.lastActivity = 'Just now';
          resolve(lead);
        } else {
          throw new Error('Lead not found');
        }
      }, 600);
    });
  },
  
  assignLead: (leadId: number, assignedTo: string) => {
    // Simulate API call with a delay
    return new Promise<Lead>((resolve) => {
      setTimeout(() => {
        const lead = mockLeads.find(l => l.id === leadId);
        if (lead) {
          lead.assignedTo = assignedTo;
          lead.lastActivity = 'Just now';
          resolve(lead);
        } else {
          throw new Error('Lead not found');
        }
      }, 600);
    });
  }
};
