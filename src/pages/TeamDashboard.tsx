
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import LeadCard from '@/components/LeadCard';
import { SidebarProvider, Sidebar, SidebarContent, SidebarTrigger } from '@/components/ui/sidebar';
import { Link, useNavigate } from 'react-router-dom';
import { 
  BarChart3, ListFilter, MessageSquare, Search, 
  Bell, LogOut, User, Users, Settings, Clock, 
  LineChart, Calendar, Home
} from 'lucide-react';
import { leadsService, Lead } from '@/utils/leadsService';
import { toast } from 'sonner';

const TeamDashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [activeMainTab, setActiveMainTab] = useState('dashboard');
  
  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const data = await leadsService.getLeadsForTeam();
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
    if (tab === 'all') return filteredLeads;
    if (tab === 'assigned') return filteredLeads.filter(lead => lead.assignedTo && lead.assignedTo !== '');
    if (tab === 'unassigned') return filteredLeads.filter(lead => !lead.assignedTo || lead.assignedTo === '');
    return filteredLeads;
  };

  // Sort leads by score (highest first)
  const sortedLeads = [...getTabLeads(activeTab)].sort((a, b) => b.score - a.score);

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
                variant={activeMainTab === 'team' ? 'default' : 'ghost'} 
                className="w-full justify-start"
                onClick={() => handleMenuClick('team')}
              >
                <Users size={18} className="mr-2" />
                Team
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
                variant={activeMainTab === 'schedule' ? 'default' : 'ghost'} 
                className="w-full justify-start"
                onClick={() => handleMenuClick('schedule')}
              >
                <Clock size={18} className="mr-2" />
                Schedule
              </Button>
              <Button 
                variant={activeMainTab === 'settings' ? 'default' : 'ghost'} 
                className="w-full justify-start"
                onClick={() => handleMenuClick('settings')}
              >
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
                <h1 className="text-xl font-semibold ml-4">Team Dashboard</h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Bell size={20} className="text-gray-500" />
                  <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary"></span>
                </div>
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                  TM
                </div>
              </div>
            </div>
          </header>
          
          <main className="p-6">
            {activeMainTab === 'dashboard' && (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">Team Lead Management</h2>
                    <p className="text-gray-500">Collaborate and manage leads with your team</p>
                  </div>
                  
                  <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                    <Button variant="outline" onClick={() => toast.success("Reports generated")}>
                      <LineChart size={16} className="mr-2" />
                      Reports
                    </Button>
                    <Button onClick={() => toast.success("Team activity viewed")}>
                      <Users size={16} className="mr-2" />
                      Team Activity
                    </Button>
                  </div>
                </div>
                
                <div className="mb-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-8">
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
                    <TabsTrigger value="all">All Leads</TabsTrigger>
                    <TabsTrigger value="assigned">Assigned</TabsTrigger>
                    <TabsTrigger value="unassigned">Unassigned</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="all" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>All Team Leads</CardTitle>
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
                                isAdmin={false} 
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
                  
                  <TabsContent value="assigned" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Assigned Leads</CardTitle>
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
                                isAdmin={false} 
                                onLeadUpdated={fetchLeads} 
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <p className="text-gray-500">No assigned leads found.</p>
                            <Button variant="outline" className="mt-4" onClick={() => setActiveTab('all')}>
                              View all leads
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="unassigned" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Unassigned Leads</CardTitle>
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
                                isAdmin={false} 
                                onLeadUpdated={fetchLeads} 
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <p className="text-gray-500">No unassigned leads found.</p>
                            <Button variant="outline" className="mt-4" onClick={() => setActiveTab('all')}>
                              View all leads
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </>
            )}
            
            {(activeMainTab === 'team' || activeMainTab === 'messages' || 
              activeMainTab === 'schedule' || activeMainTab === 'settings') && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="bg-primary/10 p-6 rounded-full mb-4">
                  {activeMainTab === 'team' && <Users size={48} className="text-primary" />}
                  {activeMainTab === 'messages' && <MessageSquare size={48} className="text-primary" />}
                  {activeMainTab === 'schedule' && <Clock size={48} className="text-primary" />}
                  {activeMainTab === 'settings' && <Settings size={48} className="text-primary" />}
                </div>
                <h2 className="text-2xl font-bold mb-2">
                  {activeMainTab === 'team' && 'Team Management'}
                  {activeMainTab === 'messages' && 'Team Messages'}
                  {activeMainTab === 'schedule' && 'Team Schedule'}
                  {activeMainTab === 'settings' && 'Team Settings'}
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

export default TeamDashboard;
