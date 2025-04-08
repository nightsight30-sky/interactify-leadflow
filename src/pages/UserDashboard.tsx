
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  MessagesSquare,
  UserCircle,
  LogOut,
  BarChartBig,
  Mail,
  Settings,
  PlusCircle
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { LeadStatus, leadsService } from '@/utils/leadsService';
import LeadCard from '@/components/LeadCard';
import MessageCenter from '@/components/messages/MessageCenter';
import { useUser } from '@/context/UserContext';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import NewLeadForm from '@/components/NewLeadForm';

const UserDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, logout } = useUser();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [leads, setLeads] = useState<any[]>([]);
  const [isLoadingLeads, setIsLoadingLeads] = useState(true);
  const userEmail = user?.email || '';

  const fetchLeads = async () => {
    setIsLoadingLeads(true);
    try {
      const userLeads = await leadsService.getUserLeads(userEmail);
      setLeads(userLeads);
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
  }, [userEmail]);

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    navigate('/login');
  };

  const handleLeadUpdated = () => {
    fetchLeads();
  };

  const handleLeadAdded = async (data: any) => {
    try {
      // Create a new lead with the form data
      await leadsService.addLead({
        name: user?.name || 'User',
        email: userEmail,
        requestType: data.requestType,
        message: data.message,
        status: 'new'
      }, false); // false means it's a registered user's lead, not a guest
      
      toast({
        title: "Success",
        description: "Your request has been submitted successfully",
      });
      
      // Refresh leads data
      fetchLeads();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit your request",
        variant: "destructive",
      });
      console.error("Error submitting request:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background page-transition">
      <nav className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto py-4 px-6 flex items-center justify-between">
          <div className="text-xl font-semibold">
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              LeadFlow
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="bg-primary text-white">
                {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'US'}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm">{user?.name}</span>
          </div>
        </div>
      </nav>
      
      <div className="flex-1">
        <div className="container mx-auto p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-64">
              <Card>
                <CardContent className="p-0">
                  <nav className="flex flex-col p-2">
                    <Button
                      variant={activeTab === 'dashboard' ? "default" : "ghost"}
                      className="justify-start mb-1"
                      onClick={() => setActiveTab('dashboard')}
                    >
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Button>
                    
                    <Button
                      variant={activeTab === 'leads' ? "default" : "ghost"}
                      className="justify-start mb-1"
                      onClick={() => setActiveTab('leads')}
                    >
                      <Users className="mr-2 h-4 w-4" />
                      My Requests
                    </Button>
                    
                    <Button
                      variant={activeTab === 'messages' ? "default" : "ghost"}
                      className="justify-start mb-1"
                      onClick={() => setActiveTab('messages')}
                    >
                      <MessagesSquare className="mr-2 h-4 w-4" />
                      Messages
                    </Button>
                    
                    <Button
                      variant={activeTab === 'profile' ? "default" : "ghost"}
                      className="justify-start mb-1"
                      onClick={() => setActiveTab('profile')}
                    >
                      <UserCircle className="mr-2 h-4 w-4" />
                      Profile
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      className="justify-start text-red-500 hover:text-red-600 hover:bg-red-50 mt-4"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </nav>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <BarChartBig className="mr-2 h-4 w-4" />
                    View Analytics
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Mail className="mr-2 h-4 w-4" />
                    Contact Support
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="mr-2 h-4 w-4" />
                    Account Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            <div className="flex-1">
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Dashboard</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-6">Welcome to your dashboard! Here you can manage your requests and communications.</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Card className="bg-blue-50">
                          <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="text-lg font-medium">{leads.length}</h3>
                                <p className="text-sm text-muted-foreground">Active Requests</p>
                              </div>
                              <Users className="h-8 w-8 text-blue-500" />
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card className="bg-emerald-50">
                          <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="text-lg font-medium">
                                  {leads.filter(lead => lead.status === 'converted').length}
                                </h3>
                                <p className="text-sm text-muted-foreground">Completed Requests</p>
                              </div>
                              <BarChartBig className="h-8 w-8 text-emerald-500" />
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <div className="mt-6">
                        <NewLeadForm onLeadAdded={handleLeadAdded} />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              {activeTab === 'leads' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">My Requests</h2>
                    <NewLeadForm onLeadAdded={handleLeadAdded} />
                  </div>
                  
                  <Card>
                    <CardContent className="pt-6">
                      {isLoadingLeads ? (
                        <div className="flex justify-center py-8">
                          <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
                        </div>
                      ) : leads.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {leads.map(lead => (
                            <LeadCard
                              key={lead.id}
                              lead={lead}
                              isAdmin={false}
                              onLeadUpdated={handleLeadUpdated}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">No requests found. Create your first request!</p>
                          <Button className="mt-4" onClick={() => setActiveTab('dashboard')}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            New Request
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
              
              {activeTab === 'messages' && (
                <MessageCenter isUserDashboard={true} userEmail={userEmail} />
              )}
              
              {activeTab === 'profile' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Profile</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex flex-col space-y-1.5">
                        <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
                        <p>{user?.name || 'Not provided'}</p>
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                        <p>{user?.email || 'Not provided'}</p>
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <h3 className="text-sm font-medium text-muted-foreground">Role</h3>
                        <p>{user?.role || 'User'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Toaster />
      <Sonner />
    </div>
  );
};

export default UserDashboard;
