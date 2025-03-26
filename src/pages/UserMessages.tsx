
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SidebarProvider, Sidebar, SidebarContent, SidebarTrigger } from '@/components/ui/sidebar';
import { Link, useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { 
  Home, MessageSquare, Bell, LogOut, 
  User, Settings, Mail, Search, Filter, 
  Clock, Send, Inbox
} from 'lucide-react';
import { leadsService, Lead } from '@/utils/leadsService';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const UserMessages = () => {
  const navigate = useNavigate();
  const [userLeads, setUserLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [reply, setReply] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [activeMainTab, setActiveMainTab] = useState('messages');

  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    const storedName = localStorage.getItem('userName');
    
    if (storedEmail && storedName) {
      setUserEmail(storedEmail);
      setUserName(storedName);
      fetchLeads(storedEmail);
    } else {
      toast.error('User session expired. Please login again.');
      navigate('/login');
    }
  }, [navigate]);

  const fetchLeads = async (email: string) => {
    setIsLoading(true);
    try {
      const data = await leadsService.getUserLeads(email);
      setUserLeads(data);
      setFilteredLeads(data);
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast.error('Failed to load your messages');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userEmail) {
      fetchLeads(userEmail);
    }
  }, [userEmail]);

  useEffect(() => {
    const filtered = userLeads.filter(lead => {
      return lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             lead.requestType.toLowerCase().includes(searchQuery.toLowerCase()) ||
             lead.message.toLowerCase().includes(searchQuery.toLowerCase());
    });
    setFilteredLeads(filtered);
  }, [userLeads, searchQuery]);

  const handleSendReply = async () => {
    if (!selectedLead || !reply.trim()) {
      toast.error('Please enter a message');
      return;
    }
    
    setIsSending(true);
    try {
      await leadsService.addInteraction(selectedLead.id, reply);
      fetchLeads(userEmail);
      setReply('');
      toast.success('Reply sent successfully');
    } catch (error) {
      console.error('Error sending reply:', error);
      toast.error('Failed to send reply');
    } finally {
      setIsSending(false);
    }
  };

  const handleMenuClick = (tab: string) => {
    setActiveMainTab(tab);
    
    // Navigate to the appropriate page
    if (tab === 'dashboard') {
      navigate('/user-dashboard');
    } else if (tab === 'email') {
      navigate('/email-history');
    } else if (tab === 'profile' || tab === 'settings') {
      // For now, stay on user dashboard with profile tab active
      navigate('/user-dashboard');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userLoggedIn');
    toast.success('Successfully logged out');
    navigate('/login');
  };

  const getInitials = (name: string) => {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'qualified': return 'bg-green-100 text-green-800';
      case 'converted': return 'bg-purple-100 text-purple-800';
      case 'lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
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
                <h1 className="text-xl font-semibold ml-4">Message Center</h1>
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold mb-1">Messages</h2>
                <p className="text-gray-500">View and respond to all your conversations</p>
              </div>
              <div className="mt-4 sm:mt-0 flex">
                <div className="relative mr-2">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search messages..."
                    className="pl-9 w-[200px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline">
                  <Filter size={16} className="mr-2" />
                  Filter
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
              <div className="md:col-span-1">
                <Card className="h-full">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="flex items-center">
                      <Inbox size={16} className="mr-2" />
                      Your Requests
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 h-[calc(100%-3.5rem)] overflow-auto">
                    {isLoading ? (
                      <div className="p-4 text-center">
                        <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                        <p className="text-sm text-gray-500">Loading messages...</p>
                      </div>
                    ) : filteredLeads.length > 0 ? (
                      <div>
                        {filteredLeads.map((lead) => (
                          <div 
                            key={lead.id} 
                            className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${selectedLead?.id === lead.id ? 'bg-gray-100' : ''}`}
                            onClick={() => setSelectedLead(lead)}
                          >
                            <div className="flex justify-between mb-1">
                              <div className="font-medium">{lead.requestType}</div>
                              <Badge className={getStatusColor(lead.status)}>
                                {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-500 truncate mb-2">{lead.message}</div>
                            <div className="flex items-center text-xs text-gray-400">
                              <Clock size={12} className="mr-1" />
                              {lead.lastActivity}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center">
                        <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 mb-4">No messages found</p>
                        <Button 
                          variant="outline" 
                          onClick={() => navigate('/user-dashboard')}
                        >
                          Create New Request
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div className="md:col-span-2">
                <Card className="h-full">
                  {selectedLead ? (
                    <div className="h-full flex flex-col">
                      <CardHeader className="border-b">
                        <div className="flex justify-between">
                          <div>
                            <CardTitle>{selectedLead.requestType}</CardTitle>
                            <div className="flex items-center mt-1 space-x-2">
                              <Badge className={getStatusColor(selectedLead.status)}>
                                {selectedLead.status.charAt(0).toUpperCase() + selectedLead.status.slice(1)}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {selectedLead.lastActivity}
                              </span>
                            </div>
                          </div>
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {getInitials(userName)}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1 overflow-auto py-4">
                        <div className="space-y-6">
                          <div className="bg-gray-100 p-4 rounded-lg">
                            <div className="flex justify-between mb-2">
                              <span className="text-xs text-gray-500">Your Request</span>
                              <span className="text-xs text-gray-500">{selectedLead.lastActivity}</span>
                            </div>
                            <p className="text-gray-800 whitespace-pre-wrap">{selectedLead.message}</p>
                          </div>
                          
                          {selectedLead.interactions > 1 && (
                            <div>
                              <h3 className="text-sm font-medium mb-2">Response History</h3>
                              <div className="bg-blue-50 p-4 rounded-lg">
                                <div className="flex justify-between mb-2">
                                  <span className="text-xs text-gray-500">From Admin</span>
                                  <span className="text-xs text-gray-500">Response Time</span>
                                </div>
                                <p className="text-gray-800">
                                  Thank you for your request. We have reviewed your inquiry and would be happy to assist you with {selectedLead.requestType.toLowerCase()}. Could you provide more details about your specific needs?
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <div className="border-t p-4">
                        <div className="space-y-4">
                          <Textarea
                            placeholder="Type your reply here..."
                            value={reply}
                            onChange={(e) => setReply(e.target.value)}
                            rows={3}
                          />
                          <div className="flex justify-end">
                            <Button 
                              onClick={handleSendReply}
                              disabled={!reply.trim() || isSending}
                            >
                              {isSending ? (
                                <>
                                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
                                  Sending...
                                </>
                              ) : (
                                <>
                                  <Send size={14} className="mr-2" />
                                  Send Reply
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full p-6">
                      <MessageSquare className="h-16 w-16 text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Message Selected</h3>
                      <p className="text-gray-500 text-center">
                        Select a message from the list to view details and respond
                      </p>
                    </div>
                  )}
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default UserMessages;
