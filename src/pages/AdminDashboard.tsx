
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import LeadCard from '@/components/LeadCard';
import LeadStats from '@/components/LeadStats';
import { SidebarProvider, Sidebar, SidebarContent, SidebarTrigger } from '@/components/ui/sidebar';
import { Link, useNavigate } from 'react-router-dom';
import { 
  BarChart3, ListFilter, MessageSquare, Search, 
  Bell, LogOut, User, Settings, Mail, Brain, 
  LineChart, PieChart, Calendar, Home 
} from 'lucide-react';

// Sample data
const mockLeads = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    score: 85,
    status: 'qualified' as const,
    lastActivity: '2 days ago',
    requestType: 'Product Inquiry',
    message: 'I\'m interested in your AI lead scoring system. Can you tell me more about the pricing?',
    interactions: 8
  },
  {
    id: '2',
    name: 'Emily Johnson',
    email: 'emily@example.com',
    score: 72,
    status: 'contacted' as const,
    lastActivity: '5 days ago',
    requestType: 'Demo Request',
    message: 'We\'re looking for a lead management system for our sales team of 15 people. Would like to see how your platform works.',
    interactions: 3
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'michael@example.com',
    score: 45,
    status: 'new' as const,
    lastActivity: '1 week ago',
    requestType: 'Support',
    message: 'Having some questions about the WhatsApp integration. How does it work with our existing system?',
    interactions: 1
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    score: 92,
    status: 'qualified' as const,
    lastActivity: '1 day ago',
    requestType: 'Demo Request',
    message: 'Our marketing team is looking for a new lead management solution that integrates with our CRM. Would like to see a demo.',
    interactions: 5
  },
  {
    id: '5',
    name: 'David Lee',
    email: 'david@example.com',
    score: 31,
    status: 'new' as const,
    lastActivity: '3 days ago',
    requestType: 'Pricing',
    message: 'How much does your basic plan cost? We\'re a small business with about 5 sales reps.',
    interactions: 2
  },
  {
    id: '6',
    name: 'Jessica Chen',
    email: 'jessica@example.com',
    score: 78,
    status: 'contacted' as const,
    lastActivity: '4 days ago',
    requestType: 'Product Inquiry',
    message: 'Does your platform integrate with Salesforce? We need a solution that works with our existing tech stack.',
    interactions: 4
  },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const handleLogout = () => {
    // In a real app, handle logout logic here
    navigate('/login');
  };

  // Filter leads based on search query and status filter
  const filteredLeads = mockLeads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Sort leads by score (highest first)
  const sortedLeads = [...filteredLeads].sort((a, b) => b.score - a.score);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full page-transition">
        <Sidebar className="border-r">
          <div className="p-4 border-b">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-semibold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                LeadFlow
              </span>
            </Link>
          </div>
          
          <SidebarContent className="p-2">
            <div className="space-y-1">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link to="/admin-dashboard">
                  <Home size={18} className="mr-2" />
                  Dashboard
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <BarChart3 size={18} className="mr-2" />
                Analytics
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Brain size={18} className="mr-2" />
                AI Insights
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <MessageSquare size={18} className="mr-2" />
                Messages
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Mail size={18} className="mr-2" />
                Email Campaigns
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Calendar size={18} className="mr-2" />
                Calendar
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <User size={18} className="mr-2" />
                Team
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Settings size={18} className="mr-2" />
                Settings
              </Button>
            </div>
            
            <div className="absolute bottom-4 left-4 right-4">
              <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50" onClick={handleLogout}>
                <LogOut size={18} className="mr-2" />
                Logout
              </Button>
            </div>
          </SidebarContent>
        </Sidebar>
        
        <div className="flex-1">
          <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <SidebarTrigger />
                <h1 className="text-xl font-semibold ml-4">Admin Dashboard</h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Bell size={20} className="text-gray-500" />
                  <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary"></span>
                </div>
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                  AD
                </div>
              </div>
            </div>
          </header>
          
          <main className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold mb-1">Lead Management</h2>
                <p className="text-gray-500">Track, analyze, and convert your leads</p>
              </div>
              
              <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                <Button variant="outline">
                  <PieChart size={16} className="mr-2" />
                  Reports
                </Button>
                <Button>
                  <LineChart size={16} className="mr-2" />
                  Analytics
                </Button>
              </div>
            </div>
            
            <LeadStats />
            
            <div className="mt-8 mb-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search leads..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="qualified">Qualified</SelectItem>
                    <SelectItem value="converted">Converted</SelectItem>
                    <SelectItem value="lost">Lost</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="outline">
                  <ListFilter size={16} className="mr-2" />
                  More Filters
                </Button>
              </div>
            </div>
            
            <Tabs defaultValue="leads" className="mb-8">
              <TabsList>
                <TabsTrigger value="leads">All Leads</TabsTrigger>
                <TabsTrigger value="highValue">High Value</TabsTrigger>
                <TabsTrigger value="recentActivity">Recent Activity</TabsTrigger>
              </TabsList>
              
              <TabsContent value="leads" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Lead Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {sortedLeads.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sortedLeads.map(lead => (
                          <LeadCard key={lead.id} lead={lead} isAdmin={true} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-gray-500">No leads found with the current filters.</p>
                        <Button variant="outline" className="mt-4" onClick={() => {
                          setSearchQuery('');
                          setStatusFilter('all');
                        }}>
                          Reset Filters
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="highValue" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>High Value Leads</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {mockLeads.filter(lead => lead.score >= 70).map(lead => (
                        <LeadCard key={lead.id} lead={lead} isAdmin={true} />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="recentActivity" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {mockLeads.filter(lead => 
                        lead.lastActivity.includes('day') || 
                        lead.lastActivity.includes('1 week')
                      ).map(lead => (
                        <LeadCard key={lead.id} lead={lead} isAdmin={true} />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            <div className="mt-12">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>AI Insights</CardTitle>
                  <Button variant="outline" size="sm">
                    <Brain size={14} className="mr-2" />
                    Analyze All Leads
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg bg-blue-50/50">
                      <h3 className="font-medium mb-2 flex items-center">
                        <Brain size={16} className="text-primary mr-2" />
                        Lead Quality Analysis
                      </h3>
                      <p className="text-sm text-gray-600">
                        The AI has detected an increase in high-quality leads from your recent marketing campaign. 
                        Consider allocating more resources to this channel.
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg bg-blue-50/50">
                      <h3 className="font-medium mb-2 flex items-center">
                        <MessageSquare size={16} className="text-primary mr-2" />
                        Communication Patterns
                      </h3>
                      <p className="text-sm text-gray-600">
                        Leads that receive a follow-up within 24 hours show a 40% higher conversion rate. 
                        5 leads in your pipeline haven't been contacted in over 48 hours.
                      </p>
                      <Button variant="outline" size="sm" className="mt-2">
                        View Leads
                      </Button>
                    </div>
                    <div className="p-4 border rounded-lg bg-blue-50/50">
                      <h3 className="font-medium mb-2 flex items-center">
                        <BarChart3 size={16} className="text-primary mr-2" />
                        Lead Score Prediction
                      </h3>
                      <p className="text-sm text-gray-600">
                        Based on historical data, leads with similar profiles to "Sarah Wilson" have a 85% chance 
                        of converting within the next 2 weeks.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
