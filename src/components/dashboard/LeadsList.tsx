
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import LeadCard from '@/components/LeadCard';
import { Lead, LeadSource } from '@/utils/leadsService';

interface LeadsListProps {
  isLoading: boolean;
  leads: Lead[];
  leadSourceTab: LeadSource | 'all';
  activeTab: string;
  setActiveTab: (value: string) => void;
  onLeadUpdated: () => void;
  renderNewLeadForm: () => React.ReactNode;
}

const LeadsList = ({ 
  isLoading, 
  leads, 
  leadSourceTab, 
  activeTab, 
  setActiveTab, 
  onLeadUpdated,
  renderNewLeadForm
}: LeadsListProps) => {
  
  const renderSkeletons = (count: number) => {
    return Array(count).fill(0).map((_, index) => (
      <Card key={index} className="animate-pulse">
        <CardHeader className="p-4">
          <div className="flex items-center space-x-3">
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
    ));
  };

  const getEmptyStateMessage = () => {
    if (activeTab === 'all') {
      return leadSourceTab === 'all' 
        ? 'No requests found' 
        : leadSourceTab === 'registered' 
          ? 'No registered user requests found' 
          : 'No guest requests found';
    } else if (activeTab === 'active') {
      return leadSourceTab === 'all' 
        ? 'No active requests found' 
        : leadSourceTab === 'registered' 
          ? 'No active registered user requests found' 
          : 'No active guest requests found';
    } else {
      return leadSourceTab === 'all' 
        ? 'No completed requests found' 
        : leadSourceTab === 'registered' 
          ? 'No completed registered user requests found' 
          : 'No completed guest requests found';
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {renderSkeletons(activeTab === 'all' ? 3 : activeTab === 'active' ? 2 : 1)}
      </div>
    );
  }

  if (leads.length > 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {leads.map(lead => (
          <LeadCard 
            key={lead.id} 
            lead={lead}
            onLeadUpdated={onLeadUpdated}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="text-center py-12 border rounded-lg bg-gray-50">
      <p className="text-gray-500 mb-4">
        {getEmptyStateMessage()}
      </p>
      {activeTab !== 'completed' ? (
        renderNewLeadForm()
      ) : (
        <Button variant="outline" onClick={() => setActiveTab('all')}>
          View all requests
        </Button>
      )}
    </div>
  );
};

export default LeadsList;
