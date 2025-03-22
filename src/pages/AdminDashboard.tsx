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
  LineChart, PieChart, Calendar, Home, Loader2
} from 'lucide-react';
import { leadsService, Lead, LeadStatus } from '@/utils/leadsService';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [activeTab, setActiveTab] = useState('leads');
  const [activeMainTab, setActiveMainTab] = useState('dashboard');
  
  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const data = await leadsService.getLeads();
      setLeads(data);
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast.error('Failed to load leads');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);
  
  const handleLogout = () => {
    toast.success('Successfully logged out');
    navigate('/login');
  };

  // Filter leads based on search query and status filter
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.requestType.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Get leads for different tabs
  const getTabLeads = (tab: string) => {
    if (tab === 'leads') return filteredLeads;
    if (tab === 'highValue') return filteredLeads.filter(lead => lead.score >= 70);
    if (tab === 'recentActivity') return filteredLeads.filter(lead => 
      lead.lastActivity.includes('day') || 
      lead.lastActivity.includes('hour') || 
      lead.lastActivity.includes('minute') || 
      lead.lastActivity.includes('Just now') || 
      lead.lastActivity.includes('1 week')
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
  };

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
                
                <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
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
                            Communication Patterns
                          </h3>
                          <p className="text-sm text-gray-600">
                            Leads that receive a follow-up within 24 hours show a 40% higher conversion rate. 
                            5 leads in your pipeline haven't been contacted in over 48 hours.
                          </p>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-2"
                            onClick={() => {
                              setActiveTab('leads');
                              setStatusFilter('new');
                              toast.success('Filtered to show new leads');
                            }}
                          >
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
              </>
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
            
            {activeMainTab !== 'dashboard' && activeMainTab !== 'profile' && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="bg-primary/10 p-6 rounded-full mb-4">
                  {activeMainTab === 'analytics' && <BarChart3 size={48} className="text-primary" />}
                  {activeMainTab === 'ai' && <Brain size={48} className="text-primary" />}
                  {activeMainTab === 'messages' && <MessageSquare size={48} className="text-primary" />}
                  {activeMainTab === 'email' && <Mail size={48} className="text-primary" />}
                  {activeMainTab === 'calendar' && <Calendar size={48} className="text-primary" />}
                  {activeMainTab === 'team' && <User size={48} className="text-primary" />}
                </div>
                <h2 className="text-2xl font-bold mb-2">
                  {activeMainTab === 'analytics' && 'Analytics Dashboard'}
                  {activeMainTab === 'ai' && 'AI Insights'}
                  {activeMainTab === 'messages' && 'Message Center'}
                  {activeMainTab === 'email' && 'Email Campaigns'}
                  {activeMainTab === 'calendar' && 'Calendar'}
                  {activeMainTab === 'team' && 'Team Management'}
                </h2>
                <p className="text-gray-500 text-center max-w-md mb-6">
                  This feature is coming soon. We're working hard to bring you the best experience possible.
                </p>
                <Button onClick={() => setActiveMainTab('dashboard')}>
                  Return to Dashboard
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
