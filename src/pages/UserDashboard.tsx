import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import LeadCard from '@/components/LeadCard';
import { SidebarProvider, Sidebar, SidebarContent, SidebarTrigger } from '@/components/ui/sidebar';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Home, ListFilter, MessageSquare, Search, 
  Bell, LogOut, User, Settings, Mail
} from 'lucide-react';
import NewLeadForm from '@/components/NewLeadForm';
import { leadsService, Lead } from '@/utils/leadsService';
import { toast } from 'sonner';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [activeMainTab, setActiveMainTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [userName, setUserName] = useState('John');
  
  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const data = await leadsService.getLeads();
      setLeads(data);
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast.error('Failed to load your requests');
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

  const filteredLeads = leads.filter(lead => {
    // Filter by search query
    const matchesQuery = 
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.requestType.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by tab
    if (activeTab === 'all') return matchesQuery;
    if (activeTab === 'active') return matchesQuery && lead.status !== 'converted' && lead.status !== 'lost';
    if (activeTab === 'completed') return matchesQuery && (lead.status === 'converted' || lead.status === 'lost');
    
    return matchesQuery;
  });

  const handleMenuClick = (tab: string) => {
    setActiveMainTab(tab);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
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
                Email History
              </Button>
              <Button 
                variant={activeMainTab === 'profile' ? 'default' : 'ghost'} 
                className="w-full justify-start"
                onClick={() => handleMenuClick('profile')}
              >
                <User size={18} className="mr-2" />
                Profile
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
                <h1 className="text-xl font-semibold ml-4">User Dashboard</h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Bell size={20} className="text-gray-500" />
                  <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary"></span>
                </div>
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                  {getInitials(userName)}
                </div>
              </div>
            </div>
          </header>
          
          <main className="p-6">
            {activeMainTab === 'dashboard' && (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">Welcome back, {userName}</h2>
                    <p className="text-gray-500">Track your requests and lead activity</p>
                  </div>
                  <div className="mt-4 sm:mt-0">
                    <NewLeadForm onLeadAdded={fetchLeads} />
                  </div>
                </div>
                
                <div className="mb-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search requests..."
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button variant="outline">
                    <ListFilter size={16} className="mr-2" />
                    Filter
                  </Button>
                </div>
                
                <Tabs defaultValue="all" className="mb-8" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList>
                    <TabsTrigger value="all">All Requests</TabsTrigger>
                    <TabsTrigger value="active">Active</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="all" className="mt-6">
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
                    ) : filteredLeads.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredLeads.map(lead => (
                          <LeadCard 
                            key={lead.id} 
                            lead={lead} 
                            onLeadUpdated={fetchLeads} 
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 border rounded-lg bg-gray-50">
                        <p className="text-gray-500 mb-4">No requests found</p>
                        <NewLeadForm onLeadAdded={fetchLeads} />
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="active" className="mt-6">
                    {isLoading ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array(2).fill(0).map((_, index) => (
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
                    ) : filteredLeads.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredLeads.map(lead => (
                          <LeadCard 
                            key={lead.id} 
                            lead={lead}
                            onLeadUpdated={fetchLeads}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 border rounded-lg bg-gray-50">
                        <p className="text-gray-500 mb-4">No active requests found</p>
                        <NewLeadForm onLeadAdded={fetchLeads} />
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="completed" className="mt-6">
                    {isLoading ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array(1).fill(0).map((_, index) => (
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
                    ) : filteredLeads.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredLeads.map(lead => (
                          <LeadCard 
                            key={lead.id} 
                            lead={lead}
                            onLeadUpdated={fetchLeads}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 border rounded-lg bg-gray-50">
                        <p className="text-gray-500 mb-4">No completed requests found</p>
                        <Button variant="outline" onClick={() => setActiveTab('all')}>
                          View all requests
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
                
                <div className="mt-12">
                  <Card>
                    <CardHeader>
                      <CardTitle>AI Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 border rounded-lg bg-blue-50/50">
                          <h3 className="font-medium mb-2">Product Suggestion</h3>
                          <p className="text-sm text-gray-600">Based on your recent inquiries, you might be interested in our Advanced Analytics package.</p>
                        </div>
                        <div className="p-4 border rounded-lg bg-blue-50/50">
                          <h3 className="font-medium mb-2">Upcoming Webinar</h3>
                          <p className="text-sm text-gray-600">Join our webinar on "Maximizing Lead Conversion" next Tuesday at 2 PM EST.</p>
                          <Button variant="outline" size="sm" className="mt-2">
                            Register Now
                          </Button>
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
                  <h2 className="text-2xl font-bold mb-1">Your Profile</h2>
                  <p className="text-gray-500">Manage your personal information</p>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex flex-col items-center space-y-4">
                        <Avatar className="h-24 w-24">
                          <AvatarFallback className="bg-primary text-white text-xl">
                            {getInitials(userName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-center">
                          <h3 className="text-lg font-semibold">{userName} Smith</h3>
                          <p className="text-sm text-gray-500">john@example.com</p>
                        </div>
                        <Button variant="outline" size="sm" className="w-full">
                          <User size={14} className="mr-2" />
                          Edit Profile
                        </Button>
                      </div>
                      
                      <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">First Name</label>
                            <Input value={userName} onChange={(e) => setUserName(e.target.value)} />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Last Name</label>
                            <Input defaultValue="Smith" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <Input defaultValue="john@example.com" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Phone</label>
                            <Input defaultValue="+1 (555) 123-4567" />
                          </div>
                        </div>
                        
                        <div className="pt-4 flex justify-end">
                          <Button onClick={() => toast.success("Profile updated successfully")}>
                            Save Changes
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Email Notifications</h3>
                          <p className="text-sm text-gray-500">Receive updates about your requests</p>
                        </div>
                        <Button 
                          variant="outline" 
                          onClick={() => toast.success("Notification preference updated")}
                        >
                          Enabled
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">SMS Notifications</h3>
                          <p className="text-sm text-gray-500">Get text messages for urgent updates</p>
                        </div>
                        <Button 
                          variant="outline" 
                          onClick={() => toast.success("Notification preference updated")}
                        >
                          Disabled
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {(activeMainTab !== 'dashboard' && activeMainTab !== 'profile') && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="bg-primary/10 p-6 rounded-full mb-4">
                  {activeMainTab === 'messages' && <MessageSquare size={48} className="text-primary" />}
                  {activeMainTab === 'email' && <Mail size={48} className="text-primary" />}
                  {activeMainTab === 'settings' && <Settings size={48} className="text-primary" />}
                </div>
                <h2 className="text-2xl font-bold mb-2">
                  {activeMainTab === 'messages' && 'Message Center'}
                  {activeMainTab === 'email' && 'Email History'}
                  {activeMainTab === 'settings' && 'Account Settings'}
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

export default UserDashboard;
