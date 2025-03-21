
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Link, useNavigate } from 'react-router-dom';
import { User, UserPlus, ListFilter, Search, Mail, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { leadsService, TeamMember } from '@/utils/leadsService';

const AdminTeam = () => {
  const navigate = useNavigate();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchTeamMembers = async () => {
      setIsLoading(true);
      try {
        const data = await leadsService.getTeamMembers();
        setTeamMembers(data);
      } catch (error) {
        console.error('Error fetching team members:', error);
        toast.error('Failed to load team data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  // Filter team members based on search query
  const filteredTeamMembers = teamMembers.filter(member => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SidebarProvider>
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                className="mr-2 p-0 h-auto" 
                onClick={() => navigate('/admin-dashboard')}
              >
                <span className="text-primary">&larr;</span>
              </Button>
              <h1 className="text-2xl font-bold">Team Management</h1>
            </div>
            <p className="text-gray-500 mt-1">Manage your team members and their roles</p>
          </div>
          
          <Button>
            <UserPlus size={16} className="mr-2" />
            Add Team Member
          </Button>
        </div>
        
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search team members..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList>
            <TabsTrigger value="all">All Members</TabsTrigger>
            <TabsTrigger value="admins">Admins</TabsTrigger>
            <TabsTrigger value="sales">Sales Team</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {Array(3).fill(0).map((_, index) => (
                      <div key={index} className="flex items-center p-4 border rounded-lg animate-pulse">
                        <div className="h-12 w-12 rounded-full bg-gray-200 mr-4"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                        </div>
                        <div className="h-8 w-16 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : filteredTeamMembers.length > 0 ? (
                  <div className="space-y-4">
                    {filteredTeamMembers.map(member => (
                      <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center space-x-4">
                          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h3 className="font-medium">{member.name}</h3>
                            <p className="text-sm text-gray-500">{member.role}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="hidden md:block">
                            <span className="text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                              {member.leads} Leads
                            </span>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="icon">
                              <Mail size={16} />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Phone size={16} />
                            </Button>
                            <Button variant="outline" size="sm">
                              <User size={14} className="mr-2" />
                              Profile
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="bg-primary/10 p-6 rounded-full mx-auto w-16 h-16 flex items-center justify-center mb-4">
                      <User size={24} className="text-primary" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No Team Members Found</h3>
                    <p className="text-gray-500 mb-4">
                      {searchQuery ? 'Try a different search term' : 'Add your first team member to get started'}
                    </p>
                    {searchQuery ? (
                      <Button variant="outline" onClick={() => setSearchQuery('')}>
                        Clear Search
                      </Button>
                    ) : (
                      <Button>
                        <UserPlus size={16} className="mr-2" />
                        Add Team Member
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="admins" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Admin Team</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="bg-primary/10 p-6 rounded-full mx-auto w-16 h-16 flex items-center justify-center mb-4">
                    <User size={24} className="text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No Admin Members</h3>
                  <p className="text-gray-500 mb-4">
                    Add admin team members to manage the system
                  </p>
                  <Button>
                    <UserPlus size={16} className="mr-2" />
                    Add Admin
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="sales" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Sales Team</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="bg-primary/10 p-6 rounded-full mx-auto w-16 h-16 flex items-center justify-center mb-4">
                    <User size={24} className="text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No Sales Team Members</h3>
                  <p className="text-gray-500 mb-4">
                    Add sales team members to help manage leads
                  </p>
                  <Button>
                    <UserPlus size={16} className="mr-2" />
                    Add Sales Member
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarProvider>
  );
};

export default AdminTeam;
