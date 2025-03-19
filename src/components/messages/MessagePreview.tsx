
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Lead } from '@/utils/leadsService';
import { Mail, User, Send, MessageSquare, Phone, Calendar, Clock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface MessagePreviewProps {
  lead: Lead | null;
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const MessagePreview = ({ lead, onSendMessage, isLoading }: MessagePreviewProps) => {
  const [replyMessage, setReplyMessage] = useState('');
  const [replyTemplate, setReplyTemplate] = useState('custom');
  const [isSending, setIsSending] = useState(false);
  
  const handleSendReply = () => {
    if (!replyMessage.trim()) {
      toast.error('Please enter a message');
      return;
    }
    
    setIsSending(true);
    
    // Simulate sending message
    setTimeout(() => {
      onSendMessage(replyMessage);
      setReplyMessage('');
      setIsSending(false);
    }, 1000);
  };
  
  const handleTemplateChange = (value: string) => {
    setReplyTemplate(value);
    
    if (value === 'custom') {
      setReplyMessage('');
      return;
    }
    
    // Pre-defined templates
    const templates: {[key: string]: string} = {
      followup: `Hi ${lead?.name},\n\nThank you for your interest in our services. I'd like to follow up on your request about "${lead?.requestType}". Would you be available for a quick call this week to discuss your needs in more detail?\n\nLooking forward to hearing from you.`,
      
      demo: `Hi ${lead?.name},\n\nThank you for your interest in a product demonstration. I'd be happy to schedule a personalized demo to show you how our solution can address your specific needs regarding "${lead?.requestType}".\n\nPlease let me know what dates and times work best for you.`,
      
      information: `Hi ${lead?.name},\n\nThank you for reaching out about "${lead?.requestType}". I've attached some additional information that should address your questions.\n\nIf you need any clarification or have further questions, please don't hesitate to ask.`,
      
      pricing: `Hi ${lead?.name},\n\nThank you for your interest in our pricing options. Based on your request about "${lead?.requestType}", I've prepared a custom quote that should fit your needs.\n\nWould you like to schedule a call to go through the details?`
    };
    
    setReplyMessage(templates[value] || '');
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading message details...</p>
      </div>
    );
  }
  
  if (!lead) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px]">
        <MessageSquare className="h-16 w-16 text-muted-foreground opacity-20 mb-4" />
        <p className="text-muted-foreground">Select a message to view details</p>
      </div>
    );
  }
  
  return (
    <>
      <CardHeader className="p-4 pb-2 border-b">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
              {lead.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <CardTitle className="text-lg">{lead.name}</CardTitle>
              <div className="flex items-center text-sm text-muted-foreground">
                <Mail className="h-3.5 w-3.5 mr-1" />
                {lead.email}
                {lead.isGuest ? (
                  <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-800">Guest</span>
                ) : (
                  <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800">Registered</span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="outline">
              <Phone size={14} className="mr-1" />
              Call
            </Button>
            <Button size="sm" variant="outline">
              <Calendar size={14} className="mr-1" />
              Schedule
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="border-b">
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="font-medium text-primary">{lead.requestType}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock size={12} className="mr-1" />
                {lead.lastActivity}
              </div>
            </div>
            <p className="text-sm whitespace-pre-line">{lead.message}</p>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">Reply</h3>
            <Select value={replyTemplate} onValueChange={handleTemplateChange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="custom">Custom Reply</SelectItem>
                <SelectItem value="followup">Follow-up Template</SelectItem>
                <SelectItem value="demo">Demo Scheduling</SelectItem>
                <SelectItem value="information">Information Sharing</SelectItem>
                <SelectItem value="pricing">Pricing Discussion</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Textarea 
            placeholder="Type your reply here..."
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
            className="min-h-[150px]"
          />
          
          <div className="flex justify-between mt-4">
            <div>
              <Button variant="outline" size="sm" className="mr-2">
                Save as Draft
              </Button>
              <Button variant="outline" size="sm">
                Add Template
              </Button>
            </div>
            <Button 
              onClick={handleSendReply} 
              disabled={!replyMessage.trim() || isSending}
            >
              {isSending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Reply
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </>
  );
};

export default MessagePreview;
