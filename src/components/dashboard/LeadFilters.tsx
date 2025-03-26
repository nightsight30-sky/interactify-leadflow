
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, UserPlus } from 'lucide-react';
import { LeadSource } from '@/utils/leadsService';

interface LeadFiltersProps {
  leadSourceTab: LeadSource | 'all';
  setLeadSourceTab: (value: LeadSource | 'all') => void;
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const LeadFilters = ({ 
  leadSourceTab, 
  setLeadSourceTab, 
  activeTab, 
  setActiveTab 
}: LeadFiltersProps) => {
  return (
    <>
      {/* Lead Source Tabs */}
      <Tabs 
        defaultValue="all" 
        className="mb-4" 
        value={leadSourceTab} 
        onValueChange={(value) => setLeadSourceTab(value as LeadSource | 'all')}
      >
        <TabsList>
          <TabsTrigger value="all">All Sources</TabsTrigger>
          <TabsTrigger value="registered">
            <User size={14} className="mr-1" />
            Your Requests
          </TabsTrigger>
          <TabsTrigger value="guest">
            <UserPlus size={14} className="mr-1" />
            Guest Requests
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      {/* Status Tabs */}
      <Tabs 
        defaultValue="all" 
        className="mb-8" 
        value={activeTab} 
        onValueChange={setActiveTab}
      >
        <TabsList>
          <TabsTrigger value="all">All Statuses</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
      </Tabs>
    </>
  );
};

export default LeadFilters;
