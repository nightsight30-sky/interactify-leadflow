
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { SidebarProvider, Sidebar, SidebarContent, SidebarTrigger } from '@/components/ui/sidebar';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Home, Users, Calendar, Settings, Activity, LogOut, 
  Mail, Send, Plus, FileText, ChevronRight
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface Campaign {
  id: string;
  name: string;
  subject: string;
  status: 'draft' | 'scheduled' | 'sent' | 'active';
  recipients: number;
  opens: number;
  clicks: number;
  date: string;
}

const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Monthly Newsletter',
    subject: 'Your Monthly Update from LeadFlow',
    status: 'sent',
    recipients: 256,
    opens: 143,
    clicks: 46,
    date: '2023-11-15'
  },
  {
    id: '2',
    name: 'Product Announcement',
    subject: 'Introducing Our New Features',
    status: 'draft',
    recipients: 0,
    opens: 0,
    clicks: 0,
    date: '-'
  },
  {
    id: '3',
    name: 'Black Friday Sale',
    subject: 'Limited Time Offer: 50% Off Premium Plans',
    status: 'scheduled',
    recipients: 420,
    opens: 0,
    clicks: 0,
    date: '2023-11-24'
  },
  {
    id: '4',
    name: 'Customer Feedback Request',
    subject: 'We Value Your Opinion - Take Our Survey',
    status: 'active',
    recipients: 185,
    opens: 92,
    clicks: 37,
    date: '2023-11-10'
  }
];

const EmailCampaign = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
  const [showNewCampaign, setShowNewCampaign] = useState(false);
  const [newCampaignName, setNewCampaignName] = useState('');
  const [newCampaignSubject, setNewCampaignSubject] = useState('');
  const [newCampaignContent, setNewCampaignContent] = useState('');
  
  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'sent': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const handleCreateCampaign = () => {
    if (!newCampaignName || !newCampaignSubject) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const newCampaign: Campaign = {
      id: (campaigns.length + 1).toString(),
      name: newCampaignName,
      subject: newCampaignSubject,
      status: 'draft',
      recipients: 0,
      opens: 0,
      clicks: 0,
      date: '-'
    };
    
    setCampaigns([...campaigns, newCampaign]);
    setShowNewCampaign(false);
    setNewCampaignName('');
    setNewCampaignSubject('');
    setNewCampaignContent('');
    toast.success('Campaign created successfully');
  };
  
  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    toast.success('Successfully logged out');
    navigate('/login');
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar className="border-r">
          <div className="p-4 border-b">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-semibold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                LeadFlow Admin
              </span>
            </Link>
          </div>
          
          <SidebarContent className="p-2">
            <div className="space-y-1">
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => navigate('/admin-dashboard')}
              >
                <Home size={18} className="mr-2" />
                Dashboard
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => navigate('/admin-dashboard')}
              >
                <Users size={18} className="mr-2" />
                Leads
              </Button>
              <Button 
                variant="default" 
                className="w-full justify-start"
              >
                <Mail size={18} className="mr-2" />
                Email Campaigns
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => navigate('/admin-calendar')}
              >
                <Calendar size={18} className="mr-2" />
                Calendar
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => navigate('/admin-team')}
              >
                <Users size={18} className="mr-2" />
                Team
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => navigate('/admin-dashboard')}
              >
                <Activity size={18} className="mr-2" />
                Analytics
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => navigate('/admin-dashboard')}
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
        
        <div className="flex-1 overflow-auto">
          <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <SidebarTrigger />
                <h1 className="text-xl font-semibold ml-4">Email Campaigns</h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-white">
                    A
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </header>
          
          <main className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold mb-1">Email Campaigns</h2>
                <p className="text-gray-500">Create and manage your email marketing campaigns</p>
              </div>
              <div className="mt-4 sm:mt-0">
                <Button onClick={() => setShowNewCampaign(true)}>
                  <Plus size={16} className="mr-2" />
                  New Campaign
                </Button>
              </div>
            </div>
            
            {showNewCampaign ? (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Create New Campaign</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Campaign Name</label>
                        <Input 
                          value={newCampaignName}
                          onChange={(e) => setNewCampaignName(e.target.value)}
                          placeholder="Enter campaign name"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Email Subject</label>
                        <Input 
                          value={newCampaignSubject}
                          onChange={(e) => setNewCampaignSubject(e.target.value)}
                          placeholder="Enter email subject"
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email Content</label>
                      <Textarea 
                        value={newCampaignContent}
                        onChange={(e) => setNewCampaignContent(e.target.value)}
                        placeholder="Type your email content here..."
                        rows={8}
                        className="mt-1"
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setShowNewCampaign(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateCampaign}>
                        Create Campaign
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-0 overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Recipients</TableHead>
                        <TableHead>Opens</TableHead>
                        <TableHead>Clicks</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {campaigns.map((campaign) => (
                        <TableRow key={campaign.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{campaign.name}</div>
                              <div className="text-sm text-gray-500 truncate max-w-xs">{campaign.subject}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(campaign.status)}>
                              {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>{campaign.recipients}</TableCell>
                          <TableCell>{campaign.opens}</TableCell>
                          <TableCell>{campaign.clicks}</TableCell>
                          <TableCell>{campaign.date}</TableCell>
                          <TableCell>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                              <ChevronRight size={16} />
                              <span className="sr-only">Open</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Total Campaigns</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{campaigns.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Total Subscribers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">842</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Average Open Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">56%</div>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="bg-blue-100 rounded-full p-2">
                        <Send size={16} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Campaign "Monthly Newsletter" was sent</p>
                        <p className="text-sm text-gray-500">2 days ago</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="bg-green-100 rounded-full p-2">
                        <FileText size={16} className="text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Campaign "Black Friday Sale" was created</p>
                        <p className="text-sm text-gray-500">5 days ago</p>
                      </div>
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

export default EmailCampaign;
