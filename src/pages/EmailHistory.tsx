
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { SidebarProvider, Sidebar, SidebarContent, SidebarTrigger } from '@/components/ui/sidebar';
import { Link, useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Home, MessageSquare, Bell, LogOut, 
  User, Settings, Mail, Search, Inbox,
  Archive, Send, Trash2, Filter, Eye, Reply
} from 'lucide-react';
import { toast } from 'sonner';

interface Email {
  id: string;
  subject: string;
  from: string;
  to: string;
  date: string;
  preview: string;
  read: boolean;
  important: boolean;
  category: 'inbox' | 'sent' | 'archived' | 'trash';
  fullMessage: string;
}

// Mock email data
const mockEmails: Email[] = [
  {
    id: '1',
    subject: 'Your Lead Request Update',
    from: 'support@leadflow.com',
    to: 'user@example.com',
    date: '2 hours ago',
    preview: "We've reviewed your request about marketing services and would like to schedule a call...",
    read: false,
    important: true,
    category: 'inbox',
    fullMessage: "Dear Customer,\n\nWe've reviewed your request about marketing services and would like to schedule a call to discuss your needs in more detail. Our marketing specialist would be happy to provide a customized solution for your business.\n\nPlease let us know what times work best for you this week.\n\nBest regards,\nThe LeadFlow Team"
  },
  {
    id: '2',
    subject: 'Custom Quote for Your Project',
    from: 'sales@leadflow.com',
    to: 'user@example.com',
    date: '1 day ago',
    preview: "Based on your recent request, we've prepared a custom quote for your project needs...",
    read: true,
    important: true,
    category: 'inbox',
    fullMessage: "Hello,\n\nBased on your recent request, we've prepared a custom quote for your project needs. The quote includes all the services you mentioned, with competitive pricing and flexible payment options.\n\nPlease find the attached document with detailed pricing information. If you have any questions or would like to make adjustments, don't hesitate to contact us.\n\nRegards,\nSales Team, LeadFlow"
  },
  {
    id: '3',
    subject: 'Question about Web Development Services',
    from: 'user@example.com',
    to: 'info@leadflow.com',
    date: '3 days ago',
    preview: "I'm interested in your web development services and would like to know more about...",
    read: true,
    important: false,
    category: 'sent',
    fullMessage: "Hello LeadFlow Team,\n\nI'm interested in your web development services and would like to know more about your process and pricing. I need a new e-commerce website for my small business that includes product listings, secure checkout, and inventory management.\n\nCould you provide some information about your experience with similar projects and an estimated timeline?\n\nThank you,\n[Your Name]"
  },
  {
    id: '4',
    subject: 'Follow Up: Your Recent Inquiry',
    from: 'support@leadflow.com',
    to: 'user@example.com',
    date: '1 week ago',
    preview: "We noticed you haven't responded to our previous email about your inquiry...",
    read: true,
    important: false,
    category: 'archived',
    fullMessage: "Dear Valued Customer,\n\nWe noticed you haven't responded to our previous email about your inquiry regarding our services. We want to ensure you have all the information you need to make a decision.\n\nIf you're still interested, please let us know, and we'll be happy to assist you further. If your needs have changed, we understand completely.\n\nThank you for considering LeadFlow.\n\nBest regards,\nCustomer Support Team"
  }
];

const EmailHistory = () => {
  const navigate = useNavigate();
  const [emails, setEmails] = useState<Email[]>(mockEmails);
  const [filteredEmails, setFilteredEmails] = useState<Email[]>(mockEmails);
  const [activeTab, setActiveTab] = useState<string>('inbox');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [activeMainTab, setActiveMainTab] = useState('email');

  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    const storedName = localStorage.getItem('userName');
    
    if (storedEmail && storedName) {
      setUserEmail(storedEmail);
      setUserName(storedName);
    } else {
      toast.error('User session expired. Please login again.');
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    // Filter emails based on active tab and search query
    const filtered = emails.filter(email => {
      const matchesTab = activeTab === 'all' || email.category === activeTab;
      const matchesSearch = email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            email.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            email.preview.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
    
    setFilteredEmails(filtered);
  }, [emails, activeTab, searchQuery]);

  const handleEmailClick = (email: Email) => {
    setSelectedEmail(email);
    
    // Mark as read
    if (!email.read) {
      const updatedEmails = emails.map(e => 
        e.id === email.id ? { ...e, read: true } : e
      );
      setEmails(updatedEmails);
    }
  };

  const handleArchive = (emailId: string) => {
    const updatedEmails = emails.map(email => 
      email.id === emailId ? { ...email, category: 'archived' } : email
    );
    setEmails(updatedEmails);
    setSelectedEmail(null);
    toast.success('Email archived');
  };

  const handleDelete = (emailId: string) => {
    const updatedEmails = emails.map(email => 
      email.id === emailId ? { ...email, category: 'trash' } : email
    );
    setEmails(updatedEmails);
    setSelectedEmail(null);
    toast.success('Email moved to trash');
  };

  const handleMenuClick = (tab: string) => {
    setActiveMainTab(tab);
    
    // Navigate to the appropriate page
    if (tab === 'dashboard') {
      navigate('/user-dashboard');
    } else if (tab === 'messages') {
      navigate('/user-messages');
    } else if (tab === 'profile') {
      // For now, stay on user dashboard with profile tab active
      navigate('/user-dashboard');
    } else if (tab === 'settings') {
      // For now, stay on user dashboard with settings tab active
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

  const renderEmailList = () => {
    if (filteredEmails.length === 0) {
      return (
        <div className="text-center py-12">
          <Mail className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No emails found</p>
        </div>
      );
    }
    
    return filteredEmails.map((email) => (
      <div 
        key={email.id} 
        className={`p-3 border-b cursor-pointer ${email.read ? 'bg-white' : 'bg-blue-50'} ${selectedEmail?.id === email.id ? 'bg-gray-100' : ''}`}
        onClick={() => handleEmailClick(email)}
      >
        <div className="flex items-center justify-between mb-1">
          <div className="font-medium">{email.category === 'sent' ? `To: ${email.to}` : email.from}</div>
          <div className="text-xs text-gray-500">{email.date}</div>
        </div>
        <div className="font-medium mb-1">{email.subject}</div>
        <div className="text-sm text-gray-500 truncate">{email.preview}</div>
        {!email.read && (
          <Badge className="mt-2 bg-blue-500">New</Badge>
        )}
        {email.important && (
          <Badge className="mt-2 ml-2 bg-amber-500">Important</Badge>
        )}
      </div>
    ));
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
                <h1 className="text-xl font-semibold ml-4">Email History</h1>
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
                <h2 className="text-2xl font-bold mb-1">Email History</h2>
                <p className="text-gray-500">View and manage all your communications</p>
              </div>
              <div className="mt-4 sm:mt-0">
                <Button>
                  <Mail className="mr-2 h-4 w-4" />
                  Compose New Email
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
              <div className="md:col-span-1">
                <Card className="h-full">
                  <CardHeader className="p-4 pb-2">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <CardTitle>Mailbox</CardTitle>
                        <Button variant="ghost" size="sm">
                          <Filter size={14} className="mr-1" />
                          Filter
                        </Button>
                      </div>
                      
                      <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search emails..."
                          className="pl-9"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      
                      <Tabs defaultValue="inbox" value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid grid-cols-4">
                          <TabsTrigger value="inbox" className="flex items-center">
                            <Inbox size={14} className="mr-1" />
                            Inbox
                          </TabsTrigger>
                          <TabsTrigger value="sent" className="flex items-center">
                            <Send size={14} className="mr-1" />
                            Sent
                          </TabsTrigger>
                          <TabsTrigger value="archived" className="flex items-center">
                            <Archive size={14} className="mr-1" />
                            Archived
                          </TabsTrigger>
                          <TabsTrigger value="trash" className="flex items-center">
                            <Trash2 size={14} className="mr-1" />
                            Trash
                          </TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0 mt-4 h-[calc(100%-7rem)] overflow-auto">
                    {renderEmailList()}
                  </CardContent>
                </Card>
              </div>
              
              <div className="md:col-span-2">
                <Card className="h-full">
                  {selectedEmail ? (
                    <div className="h-full flex flex-col">
                      <CardHeader className="border-b pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{selectedEmail.subject}</CardTitle>
                            <div className="text-sm text-gray-500 mt-1">
                              {selectedEmail.category === 'sent' ? `To: ${selectedEmail.to}` : `From: ${selectedEmail.from}`}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              {selectedEmail.date}
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => handleArchive(selectedEmail.id)}>
                              <Archive size={14} className="mr-1" />
                              Archive
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDelete(selectedEmail.id)}>
                              <Trash2 size={14} className="mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1 overflow-auto py-4">
                        <div className="whitespace-pre-line">
                          {selectedEmail.fullMessage}
                        </div>
                      </CardContent>
                      <div className="p-4 border-t">
                        <Button>
                          <Reply size={14} className="mr-1" />
                          Reply
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full p-6">
                      <div className="bg-gray-100 p-6 rounded-full mb-4">
                        <Eye size={32} className="text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">No Email Selected</h3>
                      <p className="text-gray-500 text-center">
                        Select an email from the list to view its content
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

export default EmailHistory;
