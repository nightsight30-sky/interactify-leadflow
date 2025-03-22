
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SidebarProvider, Sidebar, SidebarContent, SidebarTrigger } from '@/components/ui/sidebar';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Link, useNavigate } from 'react-router-dom';
import { 
  Home, Users, Calendar as CalendarIcon, Settings, Activity, LogOut, 
  Mail, Clock, Plus, Users as UsersIcon
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Event {
  id: string;
  title: string;
  date: Date;
  time: string;
  type: 'meeting' | 'call' | 'task';
  participants: string[];
  description: string;
}

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Team Meeting',
    date: new Date(2023, 10, 15),
    time: '10:00 AM',
    type: 'meeting',
    participants: ['Alice', 'Bob', 'Charlie'],
    description: 'Weekly team meeting to discuss project progress'
  },
  {
    id: '2',
    title: 'Client Call',
    date: new Date(2023, 10, 16),
    time: '2:00 PM',
    type: 'call',
    participants: ['John Smith'],
    description: 'Call with client to discuss requirements'
  },
  {
    id: '3',
    title: 'Follow-up with Leads',
    date: new Date(2023, 10, 17),
    time: '11:30 AM',
    type: 'task',
    participants: [],
    description: 'Send follow-up emails to new leads'
  }
];

const AdminCalendar = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState<Date | undefined>(new Date());
  const [newEventTime, setNewEventTime] = useState('');
  const [newEventType, setNewEventType] = useState<'meeting' | 'call' | 'task'>('meeting');
  const [newEventParticipants, setNewEventParticipants] = useState('');
  const [newEventDescription, setNewEventDescription] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    toast.success('Successfully logged out');
    navigate('/login');
  };
  
  const handleAddEvent = () => {
    if (!newEventTitle || !newEventDate || !newEventTime) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const newEvent: Event = {
      id: (events.length + 1).toString(),
      title: newEventTitle,
      date: newEventDate,
      time: newEventTime,
      type: newEventType,
      participants: newEventParticipants.split(',').map(p => p.trim()).filter(p => p),
      description: newEventDescription
    };
    
    setEvents([...events, newEvent]);
    setNewEventTitle('');
    setNewEventTime('');
    setNewEventType('meeting');
    setNewEventParticipants('');
    setNewEventDescription('');
    setIsDialogOpen(false);
    toast.success('Event added successfully');
  };
  
  const getEventsByDate = (date: Date | undefined) => {
    if (!date) return [];
    return events.filter(event => 
      event.date.getDate() === date.getDate() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear()
    );
  };
  
  const currentDateEvents = getEventsByDate(date);
  
  const getEventTypeColor = (type: Event['type']) => {
    switch (type) {
      case 'meeting': return 'bg-blue-100 text-blue-700';
      case 'call': return 'bg-green-100 text-green-700';
      case 'task': return 'bg-amber-100 text-amber-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar className="border-r">
          <div className="p-4 border-b">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-semibold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                LeadFlow Admin
              </span>
            </Link>
          </div>
          
          <SidebarContent className="p-2">
            <div className="space-y-1">
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => navigate('/admin-dashboard')}
              >
                <Home size={18} className="mr-2" />
                Dashboard
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => navigate('/admin-dashboard')}
              >
                <Users size={18} className="mr-2" />
                Leads
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => navigate('/email-campaign')}
              >
                <Mail size={18} className="mr-2" />
                Email Campaigns
              </Button>
              <Button 
                variant="default" 
                className="w-full justify-start"
              >
                <CalendarIcon size={18} className="mr-2" />
                Calendar
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => navigate('/admin-team')}
              >
                <Users size={18} className="mr-2" />
                Team
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => navigate('/admin-dashboard')}
              >
                <Activity size={18} className="mr-2" />
                Analytics
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => navigate('/admin-dashboard')}
              >
                <Settings size={18} className="mr-2" />
                Settings
              </Button>
            </div>
            
            <div className="absolute bottom-4 left-4 right-4">
              <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50" onClick={handleLogout}>
                <LogOut size={18} className="mr-2" />
                Logout
              </Button>
            </div>
          </SidebarContent>
        </Sidebar>
        
        <div className="flex-1 overflow-auto">
          <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <SidebarTrigger />
                <h1 className="text-xl font-semibold ml-4">Calendar</h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-white">
                    A
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </header>
          
          <main className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold mb-1">Calendar</h2>
                <p className="text-gray-500">Manage your schedule and appointments</p>
              </div>
              <div className="mt-4 sm:mt-0">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus size={16} className="mr-2" />
                      Add Event
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Event</DialogTitle>
                      <DialogDescription>
                        Create a new event in your calendar
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Event Title</label>
                          <Input 
                            value={newEventTitle}
                            onChange={(e) => setNewEventTitle(e.target.value)}
                            placeholder="Enter event title"
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Date</label>
                            <Calendar
                              mode="single"
                              selected={newEventDate}
                              onSelect={setNewEventDate}
                              className="border rounded-md"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Time</label>
                            <Input 
                              type="time"
                              value={newEventTime}
                              onChange={(e) => setNewEventTime(e.target.value)}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Event Type</label>
                          <Select value={newEventType} onValueChange={(value) => setNewEventType(value as Event['type'])}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select event type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="meeting">Meeting</SelectItem>
                              <SelectItem value="call">Call</SelectItem>
                              <SelectItem value="task">Task</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Participants</label>
                          <Input 
                            value={newEventParticipants}
                            onChange={(e) => setNewEventParticipants(e.target.value)}
                            placeholder="Enter participant names, separated by commas"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Description</label>
                          <Textarea 
                            value={newEventDescription}
                            onChange={(e) => setNewEventDescription(e.target.value)}
                            placeholder="Enter event description"
                            rows={3}
                          />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddEvent}>
                        Add Event
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-1">
                <CardContent className="p-4">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md w-full"
                  />
                </CardContent>
              </Card>
              
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>
                    {date ? date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : 'No Date Selected'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {currentDateEvents.length > 0 ? (
                    <div className="space-y-4">
                      {currentDateEvents.map((event) => (
                        <div key={event.id} className="p-4 border rounded-lg">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium text-lg">{event.title}</h3>
                              <div className="flex items-center text-gray-500 mt-1">
                                <Clock size={14} className="mr-1" />
                                <span>{event.time}</span>
                              </div>
                              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${getEventTypeColor(event.type)}`}>
                                {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                              </div>
                            </div>
                          </div>
                          {event.participants.length > 0 && (
                            <div className="mt-3 flex items-start">
                              <UsersIcon size={14} className="mr-1 mt-1 text-gray-500" />
                              <span className="text-sm text-gray-500">
                                {event.participants.join(', ')}
                              </span>
                            </div>
                          )}
                          {event.description && (
                            <p className="mt-3 text-sm text-gray-600">
                              {event.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <CalendarIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No events scheduled for this day</p>
                      <Button className="mt-4" variant="outline" onClick={() => setIsDialogOpen(true)}>
                        Add Event
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {events
                      .filter(event => new Date(event.date) >= new Date())
                      .sort((a, b) => a.date.getTime() - b.date.getTime())
                      .slice(0, 3)
                      .map(event => (
                        <div key={event.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                          <div className={`p-2 rounded-full ${getEventTypeColor(event.type)}`}>
                            <CalendarIcon size={16} />
                          </div>
                          <div>
                            <h3 className="font-medium">{event.title}</h3>
                            <p className="text-sm text-gray-500">
                              {event.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at {event.time}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminCalendar;
