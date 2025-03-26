
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { TabsContent } from '@/components/ui/tabs';
import NewLeadForm from '@/components/NewLeadForm';
import { leadsService, Lead, LeadSource } from '@/utils/leadsService';
import { toast } from 'sonner';

// Import our new components
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import SearchAndFilter from '@/components/dashboard/SearchAndFilter';
import LeadFilters from '@/components/dashboard/LeadFilters';
import LeadsList from '@/components/dashboard/LeadsList';
import RecommendationsCard from '@/components/dashboard/RecommendationsCard';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [leadSourceTab, setLeadSourceTab] = useState<LeadSource | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [leads, setLeads] = useState<Lead[]>([]);
  
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

  // First filter by lead source (guest/registered)
  const leadsBySource = leads.filter(lead => {
    if (leadSourceTab === 'all') return true;
    return lead.source === leadSourceTab;
  });

  // Then filter by search query and tab
  const filteredLeads = leadsBySource.filter(lead => {
    // Filter by search query
    const matchesQuery = 
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.requestType.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by status tab
    if (activeTab === 'all') return matchesQuery;
    if (activeTab === 'active') return matchesQuery && lead.status !== 'converted' && lead.status !== 'lost';
    if (activeTab === 'completed') return matchesQuery && (lead.status === 'converted' || lead.status === 'lost');
    
    return matchesQuery;
  });

  const renderNewLeadForm = () => (
    <NewLeadForm onLeadAdded={fetchLeads} />
  );

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full page-transition">
        <DashboardSidebar onLogout={handleLogout} />
        
        <div className="flex-1">
          <DashboardHeader title="User Dashboard" />
          
          <main className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold mb-1">Welcome back, John</h2>
                <p className="text-gray-500">Track your requests and lead activity</p>
              </div>
              <div className="mt-4 sm:mt-0">
                <NewLeadForm onLeadAdded={fetchLeads} />
              </div>
            </div>
            
            <SearchAndFilter 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
            
            <LeadFilters
              leadSourceTab={leadSourceTab}
              setLeadSourceTab={setLeadSourceTab}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
            
            <TabsContent value="all" className="mt-6">
              <LeadsList
                isLoading={isLoading}
                leads={filteredLeads}
                leadSourceTab={leadSourceTab}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onLeadUpdated={fetchLeads}
                renderNewLeadForm={renderNewLeadForm}
              />
            </TabsContent>
            
            <TabsContent value="active" className="mt-6">
              <LeadsList
                isLoading={isLoading}
                leads={filteredLeads}
                leadSourceTab={leadSourceTab}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onLeadUpdated={fetchLeads}
                renderNewLeadForm={renderNewLeadForm}
              />
            </TabsContent>
            
            <TabsContent value="completed" className="mt-6">
              <LeadsList
                isLoading={isLoading}
                leads={filteredLeads}
                leadSourceTab={leadSourceTab}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onLeadUpdated={fetchLeads}
                renderNewLeadForm={renderNewLeadForm}
              />
            </TabsContent>
            
            <RecommendationsCard />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default UserDashboard;
