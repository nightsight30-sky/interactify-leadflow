
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lead, leadsService } from '@/utils/leadsService';
import { Trash2, PhoneForwarded, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';
import LeadInteraction from './LeadInteraction';
import { useState } from 'react';

interface LeadCardProps {
  lead: Lead;
  isAdmin?: boolean;
  onLeadUpdated: () => void;
}

const LeadCard = ({ lead, isAdmin = false, onLeadUpdated }: LeadCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(false);

  const getStatusColor = (status: string): string => {
    const colors = {
      new: 'bg-blue-500',
      contacted: 'bg-yellow-500',
      qualified: 'bg-green-500',
      converted: 'bg-purple-500',
      lost: 'bg-gray-500'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    if (score >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      setIsDeleting(true);
      try {
        await leadsService.deleteLead(lead.id);
        onLeadUpdated();
      } catch (error) {
        console.error('Error deleting lead:', error);
        toast.error('Failed to delete lead');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const fetchAIRecommendations = async () => {
    try {
      const recs = await leadsService.getAIRecommendations(lead.id);
      setRecommendations(recs);
      setShowRecommendations(true);
    } catch (error) {
      console.error('Error fetching AI recommendations:', error);
      toast.error('Failed to get AI recommendations');
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="mb-1">{lead.name}</CardTitle>
            <CardDescription>{lead.email}</CardDescription>
          </div>
          <div className="flex flex-col items-end">
            <Badge className={`${getStatusColor(lead.status)} text-white`}>
              {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
            </Badge>
            {isAdmin && (
              <span className={`text-sm font-semibold mt-1 ${getScoreColor(lead.score)}`}>
                Score: {lead.score}
              </span>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="py-2 flex-grow">
        <div className="mb-4">
          <div className="text-sm font-medium text-gray-500 mb-1">
            {lead.requestType}
          </div>
          <p className="text-sm line-clamp-3">{lead.message}</p>
        </div>
        
        <div className="mt-3 text-xs text-gray-500 flex justify-between">
          <span>Last activity: {lead.lastActivity}</span>
          <span>{lead.interactions} interaction{lead.interactions !== 1 ? 's' : ''}</span>
        </div>

        {showRecommendations && recommendations.length > 0 && (
          <div className="mt-3 p-2 bg-blue-50 rounded-md">
            <h4 className="text-xs font-semibold text-blue-700 mb-1">AI Recommendations</h4>
            <ul className="text-xs text-blue-600 list-disc pl-4 space-y-1">
              {recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2">
        <div className="w-full grid grid-cols-2 gap-2">
          {isAdmin ? (
            <>
              <LeadInteraction 
                leadId={lead.id} 
                leadEmail={lead.email}
                isAdmin={true} 
                onInteractionComplete={onLeadUpdated} 
              />
              <Button size="sm" variant="outline" className="flex-1" onClick={fetchAIRecommendations}>
                <BarChart3 size={14} className="mr-1" /> AI Insights
              </Button>
            </>
          ) : (
            <>
              <LeadInteraction 
                leadId={lead.id}
                onInteractionComplete={onLeadUpdated} 
              />
              <Button size="sm" variant="outline" disabled={isDeleting} onClick={handleDelete}>
                <Trash2 size={14} className="mr-1" /> 
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default LeadCard;
