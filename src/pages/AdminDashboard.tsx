
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import LeadCard from '@/components/LeadCard';
import LeadStats from '@/components/LeadStats';
import AdminProfile from '@/components/AdminProfile';
import { SidebarProvider, Sidebar, SidebarContent, SidebarTrigger } from '@/components/ui/sidebar';
import { Link, useNavigate } from 'react-router-dom';
import { 
  BarChart3, ListFilter, MessageSquare, Search, 
  Bell, LogOut, User, Settings, Mail, Brain, 
  LineChart, PieChart, Calendar, Home, Loader2, Users, UserPlus
} from 'lucide-react';
import { leadsService, Lead, LeadStatus, TeamMember, CalendarEvent } from '@/utils/leadsService';
import { toast } from 'sonner';
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard';
import AIInsights from '@/components/ai/AIInsights';
import MessageCenter from '@/components/messages/MessageCenter';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [allLeads, setAllLeads] = useState<Lead[]>([]);
  const [guestLeads, setGuestLeads] = useState<Lead[]>([]);
  const [userLeads, setUserLeads] = useState<Lead[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [activeMainTab, setActiveMainTab] = useState('dashboard');
  const [leadTypeFilter, setLeadTypeFilter] = useState('all');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  
  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      // Get all leads
      console.log('Fetching all leads from AdminDashboard...');
      const allData = await leadsService.getLeads();
      console.log('Fetched all leads:', allData);
      setAllLeads(allData);
      
      // Get guest leads
      const guestData = await leadsService.getGuestLeads();
      setGuestLeads(guestData);
      
      // Get registered user leads
      const userData = await leadsService.getRegisteredUserLeads();
      setUserLeads(userData);
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast.error('Failed to load leads');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      const data = await leadsService.getTeamMembers();
      setTeamMembers(data);
    } catch (error) {
      console.error('Error fetching team members:', error);
      toast.error('Failed to load team data');
    }
  };

  const fetchCalendarEvents = async () => {
    try {
      const data = await leadsService.getCalendarEvents();
      setCalendarEvents(data);
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      toast.error('Failed to load calendar data');
    }
  };

  useEffect(() => {
    fetchLeads();
    
    // Load team and calendar data for respective tabs
    if (activeMainTab === 'team') {
      fetchTeamMembers();
    } else if (activeMainTab === 'calendar') {
      fetchCalendarEvents();
    }
  }, [activeMainTab]);
  
  const handleLogout = () => {
    toast.success('Successfully logged out');
    navigate('/login');
  };

  // Get the appropriate leads based on the lead type filter
  const getLeadsByType = () => {
    if (leadTypeFilter === 'guests') return guestLeads;
    if (leadTypeFilter === 'users') return userLeads;
    return allLeads;
  };

  // Filter leads based on search query and status filter
  const filteredLeads = getLeadsByType().filter(lead => {
    const matchesSearch = 
      lead.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      lead.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.message && lead.message.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (lead.requestType && lead.requestType.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Get leads for different tabs
  const getTabLeads = (tab: string) => {
    if (tab === 'leads') return filteredLeads;
    if (tab === 'highValue') return filteredLeads.filter(lead => lead.score >= 70);
    if (tab === 'recentActivity') return filteredLeads.filter(lead => 
      lead.lastActivity?.includes('day') || 
      lead.lastActivity?.includes('hour') || 
      lead.lastActivity?.includes('minute') || 
      lead.lastActivity?.includes('Just now') || 
      lead.lastActivity?.includes('1 week')
    );
    return filteredLeads;
  };

  // Sort leads by score (highest first)
  const sortedLeads = [...getTabLeads(activeTab)].sort((a, b) => b.score - a.score);

  const runAiAnalysis = () => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 2000)),
      {
        loading: 'Analyzing lead data...',
        success: 'AI analysis complete',
        error: 'Analysis failed',
      }
    );
  };

  // Handle sidebar menu clicks
  const handleMenuClick = (tab: string) => {
    setActiveMainTab(tab);
    
    // Special handling for some tabs to navigate to separate pages
    if (tab === 'calendar') {
      navigate('/admin-calendar');
    } else if (tab === 'team') {
      navigate('/admin-team');
    } else if (tab === 'email') {
      navigate('/email-campaign');
    }
  };

  // Render Team Members UI
  const renderTeamMembers = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">Team Management</h2>
        <p className="text-gray-500">Manage your team and their permissions</p>
      </div>
      
      <div className="flex justify-between mb-6">
        <Button>
          <UserPlus size={16} className="mr-2" />
          Add Team Member
        </Button>
        <Button variant="outline">
          <ListFilter size={16} className="mr-2" />
          Filter
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          {teamMembers.length > 0 ? (
            <div className="space-y-4">
              {teamMembers.map(member => (
                <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-medium">{member.name}</h3>
                      <p className="text-sm text-gray-500">{member.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                      {member.leads} Leads
                    </span>
                    <Button variant="ghost" size="sm">
                      <User size={14} className="mr-2" />
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-primary/10 p-6 rounded-full mx-auto w-16 h-16 flex items-center justify-center mb-4">
                <Users size={24} className="text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">No Team Members</h3>
              <p className="text-gray-500 mb-4">Add your first team member to get started</p>
              <Button>
                <UserPlus size={16} className="mr-2" />
                Add Team Member
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  // Render Calendar UI
  const renderCalendar = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">Calendar</h2>
        <p className="text-gray-500">Schedule and manage appointments with leads</p>
      </div>
      
      <div className="flex justify-between mb-6">
        <Button>
          <Calendar size={16} className="mr-2" />
          New Event
        </Button>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">Today</Button>
          <Button variant="outline" size="sm">Week</Button>
          <Button variant="outline" size="sm">Month</Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent>
          {calendarEvents.length > 0 ? (
            <div className="space-y-4">
              {calendarEvents.map(event => (
                <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Calendar size={16} />
                    </div>
                    <div>
                      <h3 className="font-medium">{event.title}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(event.date).toLocaleDateString()} at {new Date(event.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                      {event.type}
                    </span>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-primary/10 p-6 rounded-full mx-auto w-16 h-16 flex items-center justify-center mb-4">
                <Calendar size={24} className="text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">No Events Scheduled</h3>
              <p className="text-gray-500 mb-4">Schedule your first event with a lead</p>
              <Button>
                <Calendar size={16} className="mr-2" />
                New Event
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

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
              <Button 
                variant={activeMainTab === 'dashboard' ? 'default' : 'ghost'} 
                className="w-full justify-start" 
                onClick={() => handleMenuClick('dashboard')}
              >
                <Home size={18} className="mr-2" />
                Dashboard
              </Button>
              <Button 
                variant={activeMainTab === 'analytics' ? 'default' : 'ghost'} 
                className="w-full justify-start"
                onClick={() => handleMenuClick('analytics')}
              >
                <BarChart3 size={18} className="mr-2" />
                Analytics
              </Button>
              <Button 
                variant={activeMainTab === 'ai' ? 'default' : 'ghost'} 
                className="w-full justify-start"
                onClick={() => handleMenuClick('ai')}
              >
                <Brain size={18} className="mr-2" />
                AI Insights
              </Button>
              <Button 
                variant={activeMainTab === 'messages' ? 'default' : 'ghost'} 
                className="w-full justify-start"
                onClick={() => handleMenuClick('messages')}
              >
                <MessageSquare size={18} className="mr-2" />
                Messages
              </Button>
              <Button 
                variant={activeMainTab === 'email' ? 'default' : 'ghost'} 
                className="w-full justify-start"
                onClick={() => handleMenuClick('email')}
              >
                <Mail size={18} className="mr-2" />
                Email Campaigns
              </Button>
              <Button 
                variant={activeMainTab === 'calendar' ? 'default' : 'ghost'} 
                className="w-full justify-start"
                onClick={() => handleMenuClick('calendar')}
              >
                <Calendar size={18} className="mr-2" />
                Calendar
              </Button>
              <Button 
                variant={activeMainTab === 'team' ? 'default' : 'ghost'} 
                className="w-full justify-start"
                onClick={() => handleMenuClick('team')}
              >
                <User size={18} className="mr-2" />
                Team
              </Button>
              <Button 
                variant={activeMainTab === 'profile' ? 'default' : 'ghost'} 
                className="w-full justify-start"
                onClick={() => handleMenuClick('profile')}
              >
                <Settings size={18} className="mr-2" />
                Profile Settings
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
            {activeMainTab === 'dashboard' && (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">Lead Management</h2>
                    <p className="text-gray-500">Track, analyze, and convert your leads</p>
                  </div>
                  
                  <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                    <Button variant="outline" onClick={() => toast.success("Reports generated")}>
                      <PieChart size={16} className="mr-2" />
                      Reports
                    </Button>
                    <Button onClick={() => toast.success("Analytics dashboard opened")}>
                      <LineChart size={16} className="mr-2" />
                      Analytics
                    </Button>
                  </div>
                </div>
                
                <LeadStats />
                
                <div className="mt-8 mb-4">
                  <Tabs defaultValue="all" value={leadTypeFilter} onValueChange={setLeadTypeFilter}>
                    <TabsList>
                      <TabsTrigger value="all">All Leads</TabsTrigger>
                      <TabsTrigger value="guests">
                        <UserPlus size={16} className="mr-2" />
                        Guest Leads
                      </TabsTrigger>
                      <TabsTrigger value="users">
                        <Users size={16} className="mr-2" />
                        Registered Users
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                
                <div className="mb-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
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
                
                <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
                  <TabsList>
                    <TabsTrigger value="leads">All Leads</TabsTrigger>
                    <TabsTrigger value="highValue">High Value</TabsTrigger>
                    <TabsTrigger value="recentActivity">Recent Activity</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="leads" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>
                          {leadTypeFilter === 'guests' ? 'Guest Leads' : 
                           leadTypeFilter === 'users' ? 'Registered User Leads' : 
                           'Lead Management'}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {isLoading ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array(6).fill(0).map((_, index) => (
                              <Card key={index} className="animate-pulse">
                                <CardHeader className="p-4">
                                  <div className="flex items-center space-x-3">
                                    <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                                    <div className="space-y-2">
                                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                                      <div className="h-3 bg-gray-200 rounded w-32"></div>
                                    </div>
                                  </div>
                                </CardHeader>
                                <CardContent className="p-4">
                                  <div className="space-y-3">
                                    <div className="h-3 bg-gray-200 rounded"></div>
                                    <div className="h-3 bg-gray-200 rounded"></div>
                                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        ) : sortedLeads.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {sortedLeads.map(lead => (
                              <LeadCard 
                                key={lead.id} 
                                lead={lead} 
                                isAdmin={true} 
                                onLeadUpdated={fetchLeads} 
                              />
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
                        {isLoading ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array(3).fill(0).map((_, index) => (
                              <Card key={index} className="animate-pulse">
                                <CardHeader className="p-4">
                                  <div className="flex items-center space-x-3">
                                    <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                                    <div className="space-y-2">
                                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                                      <div className="h-3 bg-gray-200 rounded w-32"></div>
                                    </div>
                                  </div>
                                </CardHeader>
                                <CardContent className="p-4">
                                  <div className="space-y-3">
                                    <div className="h-3 bg-gray-200 rounded"></div>
                                    <div className="h-3 bg-gray-200 rounded"></div>
                                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        ) : sortedLeads.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {sortedLeads.map(lead => (
                              <LeadCard 
                                key={lead.id} 
                                lead={lead} 
                                isAdmin={true} 
                                onLeadUpdated={fetchLeads} 
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <p className="text-gray-500">No high value leads found.</p>
                            <Button variant="outline" className="mt-4" onClick={() => setActiveTab('leads')}>
                              View all leads
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="recentActivity" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {isLoading ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array(3).fill(0).map((_, index) => (
                              <Card key={index} className="animate-pulse">
                                <CardHeader className="p-4">
                                  <div className="flex items-center space-x-3">
                                    <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                                    <div className="space-y-2">
                                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                                      <div className="h-3 bg-gray-200 rounded w-32"></div>
                                    </div>
                                  </div>
                                </CardHeader>
                                <CardContent className="p-4">
                                  <div className="space-y-3">
                                    <div className="h-3 bg-gray-200 rounded"></div>
                                    <div className="h-3 bg-gray-200 rounded"></div>
                                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        ) : sortedLeads.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {sortedLeads.map(lead => (
                              <LeadCard 
                                key={lead.id} 
                                lead={lead} 
                                isAdmin={true} 
                                onLeadUpdated={fetchLeads} 
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <p className="text-gray-500">No recent activity found.</p>
                            <Button variant="outline" className="mt-4" onClick={() => setActiveTab('leads')}>
                              View all leads
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
                
                <div className="mt-12">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>AI Insights</CardTitle>
                      <Button variant="outline" size="sm" onClick={runAiAnalysis}>
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
                            Lead Type Comparison
                          </h3>
                          <p className="text-sm text-gray-600">
                            Registered user leads have a 35% higher conversion rate than guest leads. 
                            Consider implementing a streamlined registration process to convert more guests into registered users.
                          </p>
                          <div className="flex space-x-2 mt-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => {
                                setLeadTypeFilter('users');
                                toast.success('Showing registered user leads');
                              }}
                            >
                              <Users size={14} className="mr-2" />
                              View User Leads
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => {
                                setLeadTypeFilter('guests');
                                toast.success('Showing guest leads');
                              }}
                            >
                              <UserPlus size={14} className="mr-2" />
                              View Guest Leads
                            </Button>
                          </div>
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
              </>
            )}
            
            {activeMainTab === 'analytics' && (
              <AnalyticsDashboard />
            )}
            
            {activeMainTab === 'ai' && (
              <AIInsights />
            )}
            
            {activeMainTab === 'messages' && (
              <MessageCenter />
            )}
            
            {activeMainTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-1">Profile Settings</h2>
                  <p className="text-gray-500">Manage your account preferences and profile information</p>
                </div>
                <AdminProfile />
              </div>
            )}
            
            {activeMainTab === 'team' && renderTeamMembers()}
            
            {activeMainTab === 'calendar' && renderCalendar()}
            
            {activeMainTab === 'email' && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="bg-primary/10 p-6 rounded-full mb-4">
                  <Mail size={48} className="text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Email Campaigns</h2>
                <p className="text-gray-500 text-center max-w-md mb-6">
                  Create, manage, and track email campaigns to engage with your leads effectively.
                </p>
                <Button onClick={() => navigate('/email-campaign')}>
                  Go to Email Campaigns
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
