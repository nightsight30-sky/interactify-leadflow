
import { Lead } from '@/utils/leadsService';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface MessageListProps {
  leads: Lead[];
  selectedLead: Lead | null;
  onSelectLead: (lead: Lead) => void;
  isLoading: boolean;
}

const MessageList = ({ leads, selectedLead, onSelectLead, isLoading }: MessageListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-3 px-4 py-2">
        {Array(5).fill(0).map((_, index) => (
          <div key={index} className="flex gap-3 items-center">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (leads.length === 0) {
    return (
      <div className="flex justify-center items-center h-60">
        <p className="text-gray-500 text-sm">No messages found</p>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };
  
  return (
    <div>
      {leads.map((lead) => (
        <button
          key={lead.id}
          onClick={() => onSelectLead(lead)}
          className={`w-full text-left p-4 border-b hover:bg-gray-50 transition-colors flex gap-3 items-start ${
            selectedLead?.id === lead.id ? 'bg-blue-50 hover:bg-blue-50' : ''
          }`}
        >
          <Avatar className="h-10 w-10 flex-shrink-0">
            <AvatarFallback className="bg-primary/10 text-primary">
              {getInitials(lead.name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-1">
              <h4 className="font-medium text-sm truncate">{lead.name}</h4>
              <span className="text-xs text-gray-500">{lead.lastActivity}</span>
            </div>
            <p className="text-xs text-gray-500 mb-1 truncate">{lead.email}</p>
            <p className="text-xs truncate">{lead.message}</p>
          </div>
        </button>
      ))}
    </div>
  );
};

export default MessageList;
