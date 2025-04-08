
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
  Settings
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { LeadStatus, leadsService } from '@/utils/leadsService';
import LeadCard from '@/components/LeadCard';
import MessageCenter from '@/components/messages/MessageCenter';
import { useUser } from '@/context/UserContext';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

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
                      My Leads
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
                      Welcome to your dashboard!
                    </CardContent>
                  </Card>
                </div>
              )}
              
              {activeTab === 'leads' && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>My Leads</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {isLoadingLeads ? (
                        <div>Loading leads...</div>
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
                        <div>No leads found.</div>
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
                    User profile information.
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
