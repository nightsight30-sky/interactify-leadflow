
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Lead } from '@/utils/leadsService';
import { Loader2, Send, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { emailService } from '@/utils/emailService';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MessagePreviewProps {
  lead: Lead | null;
  onSendMessage?: (message: string) => void;
  isLoading?: boolean;
}

const MessagePreview = ({ lead, onSendMessage, isLoading = false }: MessagePreviewProps) => {
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<{ content: string; isAdmin: boolean; timestamp: string }[]>([]);

  // Load or initialize messages when lead changes
  useEffect(() => {
    if (lead?.interactions) {
      // Check if interactions is an array (not a number)
      if (Array.isArray(lead.interactions)) {
        setMessages(lead.interactions.map(interaction => ({
          content: interaction.message,
          isAdmin: interaction.isAdmin,
          timestamp: interaction.timestamp || new Date().toLocaleTimeString()
        })));
      } else {
        // If it's just a number, initialize with an empty array
        setMessages([]);
      }
    } else {
      setMessages([]);
    }
  }, [lead]);
  
  const handleSendMessage = async () => {
    if (!lead || !message.trim()) return;
    
    try {
      setIsSending(true);
      
      // Send email notification with the message
      const emailSubject = subject.trim() || `Regarding your ${lead.requestType} request`;
      await emailService.sendDirectMessage(
        lead.email, 
        lead.name, 
        emailSubject, 
        message
      );
      
      // Add message to local state immediately for better UX
      const newMessage = {
        content: message,
        isAdmin: true,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, newMessage]);
      
      // Call the parent component's handler if provided
      if (onSendMessage) {
        onSendMessage(message);
      }
      
      // Clear the input fields after sending
      setMessage('');
      setSubject('');
      
      toast.success('Message sent successfully');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };
  
  if (isLoading) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }
  
  if (!lead) {
    return (
      <Card className="h-full">
        <CardContent className="flex flex-col items-center justify-center h-full py-12">
          <Mail className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Select a lead to view their message</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="border-b pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{lead.name}</CardTitle>
            <div className="text-sm text-muted-foreground mt-1">{lead.email}</div>
          </div>
          
          <div className="flex flex-col items-end">
            <Badge variant={lead.isGuest ? "secondary" : "outline"}>
              {lead.isGuest ? 'Guest' : 'Registered'}
            </Badge>
            <div className="mt-1">
              <Badge variant={
                lead.status === 'new' ? "default" :
                lead.status === 'contacted' ? "secondary" : 
                lead.status === 'qualified' ? "outline" :
                lead.status === 'converted' ? "default" : "destructive"
              }>
                {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-4 pt-4">
        <div className="flex-1 overflow-auto mb-4">
          <div className="mb-6">
            <div className="text-sm font-medium mb-2">Request Type:</div>
            <div className="text-sm px-3 py-2 bg-muted rounded-md">
              {lead.requestType}
            </div>
          </div>
          
          <ScrollArea className="h-[200px] pr-4">
            {messages.length > 0 ? (
              <div className="space-y-3">
                {/* Initial message from lead */}
                <div className="flex justify-end">
                  <div className="max-w-[75%] bg-blue-500 text-white rounded-2xl rounded-tr-none p-3">
                    <p className="text-sm">{lead.message}</p>
                    <p className="text-xs text-blue-100 text-right mt-1">
                      {lead.lastActivity || "Recently"}
                    </p>
                  </div>
                </div>
                
                {/* Conversation messages */}
                {messages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.isAdmin ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[75%] p-3 rounded-2xl ${
                      msg.isAdmin 
                        ? 'bg-gray-100 text-gray-800 rounded-tl-none' 
                        : 'bg-blue-500 text-white rounded-tr-none'
                    }`}>
                      <p className="text-sm">{msg.content}</p>
                      <p className={`text-xs text-right mt-1 ${
                        msg.isAdmin ? 'text-gray-500' : 'text-blue-100'
                      }`}>
                        {msg.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-center text-muted-foreground">
                <p>No message history yet</p>
              </div>
            )}
          </ScrollArea>
        </div>
        
        <div className="border-t pt-4">
          <h3 className="font-medium text-sm mb-3">Send Response:</h3>
          
          <Input
            placeholder="Subject (optional)"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="mb-3"
          />
          
          <div className="flex">
            <Textarea
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={2}
              className="flex-1 resize-none rounded-r-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            
            <Button 
              onClick={handleSendMessage}
              disabled={!message.trim() || isSending}
              className="rounded-l-none bg-blue-500 hover:bg-blue-600"
            >
              {isSending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MessagePreview;
