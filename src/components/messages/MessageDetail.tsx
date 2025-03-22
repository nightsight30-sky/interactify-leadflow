
import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Lead, leadsService } from '@/utils/leadsService';
import { toast } from 'sonner';
import { Send, Clock, BarChart, Tag } from 'lucide-react';
import LeadScoreAnalysis from '../analytics/LeadScoreAnalysis';

interface MessageDetailProps {
  lead: Lead | null;
  onInteractionComplete: () => void;
}

const MessageDetail = ({ lead, onInteractionComplete }: MessageDetailProps) => {
  const [response, setResponse] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSendResponse = async () => {
    if (!lead || !response.trim()) return;

    setIsSending(true);
    try {
      await leadsService.addInteraction(lead.id, response);
      setResponse('');
      onInteractionComplete();
      toast.success('Response sent successfully');
    } catch (error) {
      console.error('Error sending response:', error);
      toast.error('Failed to send response');
    } finally {
      setIsSending(false);
    }
  };

  if (!lead) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="p-6 text-center">
          <p className="text-gray-500">Select a message to view details</p>
        </div>
      </div>
    );
  }

  const getInitials = (name: string) => {
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
    <div className="flex flex-col h-full">
      <Card className="flex-1 flex flex-col">
        <CardHeader className="border-b">
          <div className="flex justify-between items-start">
            <div className="flex items-start space-x-4">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {getInitials(lead.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-base">{lead.name}</CardTitle>
                <div className="text-sm text-gray-500">{lead.email}</div>
                <div className="flex items-center mt-1 space-x-2">
                  <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(lead.status)}`}>
                    {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                  </span>
                  <span className="flex items-center text-xs text-gray-500">
                    <Clock size={12} className="mr-1" />
                    {lead.lastActivity}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <span className="flex items-center px-2 py-1 bg-primary/10 rounded-md text-xs text-primary">
                <Tag size={12} className="mr-1" />
                {lead.requestType}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto p-4">
          <div className="space-y-6">
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-xs text-gray-500">Original Message</span>
                <span className="text-xs text-gray-500">{lead.lastActivity}</span>
              </div>
              <p className="text-gray-800 whitespace-pre-wrap">{lead.message}</p>
            </div>
            
            <LeadScoreAnalysis lead={lead} />
            
            {lead.interactions > 1 && (
              <div>
                <h3 className="text-sm font-medium mb-2">Interaction History</h3>
                <div className="text-sm text-gray-500">
                  This lead has had {lead.interactions} interactions.
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="border-t p-4">
          <div className="w-full space-y-3">
            <Textarea
              placeholder="Type your response..."
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              className="w-full min-h-[120px]"
            />
            <div className="flex justify-end">
              <Button onClick={handleSendResponse} disabled={!response.trim() || isSending}>
                {isSending ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={16} className="mr-2" />
                    Send Response
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default MessageDetail;
