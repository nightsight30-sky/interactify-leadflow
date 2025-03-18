
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import LeadCard from '@/components/LeadCard';
import { SidebarProvider, Sidebar, SidebarContent, SidebarTrigger } from '@/components/ui/sidebar';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Home, ListFilter, MessageSquare, Search, 
  Bell, LogOut, User, Settings, Mail, PlusCircle
} from 'lucide-react';

// Sample data
const mockLeads = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    score: 85,
    status: 'qualified' as const,
    lastActivity: '2 days ago',
    requestType: 'Product Inquiry',
    message: 'I\'m interested in your AI lead scoring system. Can you tell me more about the pricing?',
    interactions: 8
  },
  {
    id: '2',
    name: 'Emily Johnson',
    email: 'emily@example.com',
    score: 72,
    status: 'contacted' as const,
    lastActivity: '5 days ago',
    requestType: 'Demo Request',
    message: 'We\'re looking for a lead management system for our sales team of 15 people. Would like to see how your platform works.',
    interactions: 3
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'michael@example.com',
    score: 45,
    status: 'new' as const,
    lastActivity: '1 week ago',
    requestType: 'Support',
    message: 'Having some questions about the WhatsApp integration. How does it work with our existing system?',
    interactions: 1
  }
];

const UserDashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleLogout = () => {
    // In a real app, handle logout logic here
    navigate('/login');
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
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link to="/user-dashboard">
                  <Home size={18} className="mr-2" />
                  Dashboard
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <MessageSquare size={18} className="mr-2" />
                Messages
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Mail size={18} className="mr-2" />
                Email History
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <User size={18} className="mr-2" />
                Profile
              </Button>
              <Button variant="ghost" className="w-full justify-start">
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
                  JS
                </div>
              </div>
            </div>
          </header>
          
          <main className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold mb-1">Welcome back, John</h2>
                <p className="text-gray-500">Track your requests and lead activity</p>
              </div>
              <Button className="mt-4 sm:mt-0" asChild>
                <Link to="#contact">
                  <PlusCircle size={16} className="mr-2" />
                  New Request
                </Link>
              </Button>
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
            
            <Tabs defaultValue="all" className="mb-8">
              <TabsList>
                <TabsTrigger value="all">All Requests</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockLeads.map(lead => (
                    <LeadCard key={lead.id} lead={lead} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="active" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockLeads.filter(lead => lead.status !== 'converted' && lead.status !== 'lost').map(lead => (
                    <LeadCard key={lead.id} lead={lead} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="completed" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockLeads.filter(lead => lead.status === 'converted' || lead.status === 'lost').map(lead => (
                    <LeadCard key={lead.id} lead={lead} />
                  ))}
                </div>
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
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default UserDashboard;
