
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Lead } from '@/utils/leadsService';
import { User, Send, Mail } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface MessagePreviewProps {
  lead: Lead | null;
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const MessagePreview = ({ lead, onSendMessage, isLoading }: MessagePreviewProps) => {
  const [message, setMessage] = useState('');
  
  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  if (isLoading) {
    return (
      <CardContent className="flex items-center justify-center h-[500px]">
        <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
      </CardContent>
    );
  }

  if (!lead) {
    return (
      <CardContent className="flex items-center justify-center h-[500px]">
        <div className="text-center">
          <div className="bg-gray-100 p-6 rounded-full mx-auto mb-4 w-16 h-16 flex items-center justify-center">
            <User className="text-gray-400 h-8 w-8" />
          </div>
          <h3 className="font-medium mb-2">No message selected</h3>
          <p className="text-sm text-gray-500">Select a conversation from the list</p>
        </div>
      </CardContent>
    );
  }

  return (
    <>
      <CardHeader className="p-4 pb-2 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 text-primary">
                {getInitials(lead.name)}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <CardTitle className="text-base flex items-center">
                {lead.name}
                {lead.isGuest && (
                  <Badge variant="outline" className="ml-2 text-xs">Guest</Badge>
                )}
              </CardTitle>
              <div className="text-sm text-gray-500 flex items-center">
                <Mail className="h-3 w-3 mr-1" />
                {lead.email}
              </div>
            </div>
          </div>
          
          <Badge variant="outline" className="capitalize">{lead.requestType}</Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="h-[350px] overflow-y-auto mb-4 space-y-3">
          <div className="flex flex-col space-y-2">
            <div className="bg-gray-100 p-3 rounded-lg max-w-[85%] self-start">
              <div className="text-xs text-gray-500 mb-1">Initial Message · {lead.lastActivity}</div>
              <p className="text-gray-700 text-sm whitespace-pre-wrap">{lead.message}</p>
            </div>
            
            {/* Show the notes as conversation messages */}
            {lead.notes?.map((note, index) => (
              <div key={index} className="bg-blue-100 p-3 rounded-lg max-w-[85%] self-end">
                <div className="text-xs text-blue-500 mb-1">Response</div>
                <p className="text-gray-700 text-sm whitespace-pre-wrap">{note}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Textarea
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button onClick={handleSendMessage} className="flex-shrink-0">
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
        </div>
      </CardContent>
    </>
  );
};

export default MessagePreview;
