
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { leadsService, Lead } from '@/utils/leadsService';
import { toast } from 'sonner';
import { Search, Mail, MessageSquare, Filter } from 'lucide-react';
import MessageList from './MessageList';
import MessageDetail from './MessageDetail';

const MessageCenter = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [messageType, setMessageType] = useState('all');
  
  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const data = await leadsService.getLeads();
      setLeads(data);
      applyFilters(data, searchQuery, messageType);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchLeads();
  }, []);
  
  const applyFilters = (leadData: Lead[], query: string, type: string) => {
    let filtered = [...leadData];
    
    // Apply message type filter
    if (type === 'unread') {
      filtered = filtered.filter(lead => lead.status === 'new');
    } else if (type === 'important') {
      filtered = filtered.filter(lead => lead.score >= 70);
    } else if (type === 'registered') {
      filtered = filtered.filter(lead => lead.isGuest === false);
    } else if (type === 'guest') {
      filtered = filtered.filter(lead => lead.isGuest === true);
    }
    
    // Apply search query
    if (query) {
      const queryLower = query.toLowerCase();
      filtered = filtered.filter(
        lead => 
          lead.name.toLowerCase().includes(queryLower) ||
          lead.email.toLowerCase().includes(queryLower) ||
          lead.message.toLowerCase().includes(queryLower) ||
          lead.requestType.toLowerCase().includes(queryLower)
      );
    }
    
    setFilteredLeads(filtered);
  };
  
  useEffect(() => {
    applyFilters(leads, searchQuery, messageType);
  }, [leads, searchQuery, messageType]);
  
  const handleSelectLead = (lead: Lead) => {
    setSelectedLead(lead);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-1">Message Center</h2>
          <p className="text-gray-500">Manage and respond to all incoming messages</p>
        </div>
        <div className="flex items-center mt-4 sm:mt-0">
          <Button variant="outline" className="mr-2">
            <Mail className="mr-2 h-4 w-4" />
            Compose
          </Button>
          <Button>
            <MessageSquare className="mr-2 h-4 w-4" />
            Bulk Actions
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card className="h-[calc(100vh-12rem)]">
            <CardHeader className="pb-0">
              <div className="space-y-4">
                <CardTitle>Messages</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search messages..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <Tabs defaultValue="all" value={messageType} onValueChange={setMessageType}>
                  <TabsList className="grid grid-cols-4">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="unread">New</TabsTrigger>
                    <TabsTrigger value="important">Important</TabsTrigger>
                    <TabsTrigger value="registered">Registered</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent className="p-0 mt-4 h-[calc(100%-7rem)] overflow-auto">
              <MessageList
                leads={filteredLeads}
                selectedLead={selectedLead}
                onSelectLead={handleSelectLead}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card className="h-[calc(100vh-12rem)]">
            <MessageDetail 
              lead={selectedLead} 
              onInteractionComplete={fetchLeads}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MessageCenter;
