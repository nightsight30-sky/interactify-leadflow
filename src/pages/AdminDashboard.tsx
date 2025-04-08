
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { SidebarProvider, Sidebar, SidebarContent, SidebarTrigger } from '@/components/ui/sidebar';
import { Link, useNavigate } from 'react-router-dom';
import {
  BarChartBig,
  Users,
  Settings,
  LogOut,
  Bell,
  Filter,
  Search,
  LayoutDashboard,
  MessagesSquare,
  Mail,
  UserCog,
  LifeBuoy
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast";
import AdminProfile from '@/components/AdminProfile';
import LeadStats from '@/components/LeadStats';
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LeadStatus, leadsService } from '@/utils/leadsService';
import { Badge } from '@/components/ui/badge';
import LeadCard from '@/components/LeadCard';
import MessageCenter from '@/components/messages/MessageCenter';
import AIInsights from '@/components/ai/AIInsights';
import TeamManagement from '@/components/team/TeamManagement';

// We're defining these status options here for the filter
const statusOptions: { value: LeadStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All Statuses' },
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'converted', label: 'Converted' },
  { value: 'lost', label: 'Lost' },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeMenuTab, setActiveMenuTab] = useState<string>('dashboard');
  
  // For leads filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all');
  const [guestFilter, setGuestFilter] = useState<boolean | null>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<any[]>([]);
  const [isLoadingLeads, setIsLoadingLeads] = useState(true);

  const fetchLeads = async () => {
    setIsLoadingLeads(true);
    try {
      const allLeads = await leadsService.getLeads();
      setLeads(allLeads);
      setFilteredLeads(allLeads);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch leads data",
        variant: "destructive",
      });
      console.error("Error fetching leads:", error);
    } finally {
      setIsLoadingLeads(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Filter leads based on search, status and guest criteria
  useEffect(() => {
    let filtered = [...leads];
    
    // Apply search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(lead => 
        lead.name.toLowerCase().includes(query) ||
        lead.email.toLowerCase().includes(query) ||
        lead.message.toLowerCase().includes(query) ||
        lead.requestType.toLowerCase().includes(query)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(lead => lead.status === statusFilter);
    }
    
    // Apply guest filter
    if (guestFilter !== null) {
      filtered = filtered.filter(lead => lead.isGuest === guestFilter);
    }
    
    setFilteredLeads(filtered);
  }, [searchQuery, statusFilter, guestFilter, leads]);

  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    navigate('/login');
  };
  
  const handleLeadUpdated = () => {
    fetchLeads();
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col md:flex-row page-transition">
        <Sidebar className="border-r">
          <div className="p-4 border-b">
            <Link to="/" className="flex items-center text-2xl font-semibold gap-2">
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                LeadFlow
              </span>
              <Badge variant="outline" className="text-xs font-normal">Admin</Badge>
            </Link>
          </div>

          <SidebarContent className="px-2 py-4">
            <div className="space-y-1">
              <Button
                variant={activeMenuTab === 'dashboard' ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveMenuTab('dashboard')}
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
              
              <Button
                variant={activeMenuTab === 'analytics' ? "default" : "ghost"} 
                className="w-full justify-start" 
                onClick={() => setActiveMenuTab('analytics')}
              >
                <BarChartBig className="mr-2 h-4 w-4" />
                Analytics
              </Button>
              
              <Button
                variant={activeMenuTab === 'leads' ? "default" : "ghost"} 
                className="w-full justify-start" 
                onClick={() => setActiveMenuTab('leads')}
              >
                <Users className="mr-2 h-4 w-4" />
                All Leads
              </Button>
              
              <Button
                variant={activeMenuTab === 'messages' ? "default" : "ghost"} 
                className="w-full justify-start" 
                onClick={() => setActiveMenuTab('messages')}
              >
                <MessagesSquare className="mr-2 h-4 w-4" />
                Messages
              </Button>

              <Button
                variant={activeMenuTab === 'team' ? "default" : "ghost"} 
                className="w-full justify-start" 
                onClick={() => setActiveMenuTab('team')}
              >
                <UserCog className="mr-2 h-4 w-4" />
                Team Management
              </Button>
              
              <Button
                variant={activeMenuTab === 'ai' ? "default" : "ghost"} 
                className="w-full justify-start" 
                onClick={() => setActiveMenuTab('ai')}
              >
                <LifeBuoy className="mr-2 h-4 w-4" />
                AI Insights
              </Button>

              <Button
                variant={activeMenuTab === 'settings' ? "default" : "ghost"} 
                className="w-full justify-start" 
                onClick={() => setActiveMenuTab('settings')}
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </div>

            <div className="absolute bottom-4 left-4 right-4">
              <Button
                variant="ghost" 
                className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50" 
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 flex flex-col max-h-screen overflow-hidden">
          <header className="border-b py-3 px-4 bg-white sticky top-0 z-10">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <SidebarTrigger />
                <h1 className="text-xl font-semibold ml-4">{
                  activeMenuTab === 'dashboard' ? 'Admin Dashboard' :
                  activeMenuTab === 'analytics' ? 'Analytics' :
                  activeMenuTab === 'leads' ? 'All Leads' :
                  activeMenuTab === 'messages' ? 'Message Center' :
                  activeMenuTab === 'team' ? 'Team Management' :
                  activeMenuTab === 'ai' ? 'AI Insights' :
                  activeMenuTab === 'settings' ? 'Settings' : 'Admin Dashboard'
                }</h1>
              </div>

              <div className="flex items-center gap-4">
                <Button variant="outline" size="icon">
                  <Bell className="h-4 w-4" />
                </Button>
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-primary text-white">AD</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-6">
            {activeMenuTab === 'dashboard' && (
              <div className="space-y-6">
                <LeadStats />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Recent Leads</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {isLoadingLeads ? (
                        <div className="space-y-4">
                          {Array(3).fill(0).map((_, i) => (
                            <div key={i} className="flex items-center space-x-4 animate-pulse">
                              <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                              <div className="space-y-2 flex-1">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {leads.slice(0, 3).map(lead => (
                            <div key={lead.id} className="flex items-center space-x-4 p-2 hover:bg-gray-50 rounded-md transition-colors">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback className="bg-primary/10 text-primary">
                                  {lead.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="font-medium">{lead.name}</div>
                                <div className="text-sm text-gray-500">{lead.email}</div>
                              </div>
                              <Badge>{lead.status}</Badge>
                            </div>
                          ))}
                          
                          <Button 
                            variant="outline" 
                            className="w-full" 
                            onClick={() => setActiveMenuTab('leads')}
                          >
                            View All Leads
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <Button className="w-full" onClick={() => setActiveMenuTab('team')}>
                          <UserCog className="mr-2 h-4 w-4" />
                          Manage Team
                        </Button>
                        <Button className="w-full" variant="outline" onClick={() => setActiveMenuTab('messages')}>
                          <Mail className="mr-2 h-4 w-4" />
                          View Messages
                        </Button>
                        <Button className="w-full" variant="outline" onClick={() => setActiveMenuTab('analytics')}>
                          <BarChartBig className="mr-2 h-4 w-4" />
                          View Analytics
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeMenuTab === 'analytics' && <AnalyticsDashboard />}
            
            {activeMenuTab === 'leads' && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      className="pl-9"
                      placeholder="Search leads..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Tabs value={statusFilter} onValueChange={(value) => setStatusFilter(value as LeadStatus | 'all')}>
                      <TabsList>
                        {statusOptions.map((option) => (
                          <TabsTrigger key={option.value} value={option.value}>
                            {option.label}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                    </Tabs>
                    
                    <Button 
                      variant={guestFilter === true ? "default" : "outline"} 
                      onClick={() => setGuestFilter(guestFilter === true ? null : true)}
                    >
                      Guest
                    </Button>
                    
                    <Button 
                      variant={guestFilter === false ? "default" : "outline"} 
                      onClick={() => setGuestFilter(guestFilter === false ? null : false)}
                    >
                      Registered
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => {
                        setSearchQuery('');
                        setStatusFilter('all');
                        setGuestFilter(null);
                      }}
                    >
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {isLoadingLeads ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array(6).fill(0).map((_, i) => (
                      <Card key={i} className="animate-pulse">
                        <CardHeader className="p-4">
                          <div className="flex items-center space-x-4">
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
                        isAdmin={true}
                        onLeadUpdated={handleLeadUpdated}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="border rounded-md p-8 text-center">
                    <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                      <Users className="h-6 w-6 text-gray-500" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No leads found</h3>
                    <p className="text-gray-500 mb-4 max-w-md mx-auto">
                      No leads match your current search and filter criteria. Try adjusting your filters or create new leads.
                    </p>
                    <div className="flex justify-center gap-4">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setSearchQuery('');
                          setStatusFilter('all');
                          setGuestFilter(null);
                        }}
                      >
                        Clear Filters
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeMenuTab === 'messages' && (
              <MessageCenter />
            )}

            {activeMenuTab === 'team' && (
              <TeamManagement />
            )}
            
            {activeMenuTab === 'ai' && (
              <AIInsights />
            )}
            
            {activeMenuTab === 'settings' && (
              <AdminProfile />
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
