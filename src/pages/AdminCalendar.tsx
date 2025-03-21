
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { leadsService, CalendarEvent } from '@/utils/leadsService';

const AdminCalendar = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const data = await leadsService.getCalendarEvents();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching calendar events:', error);
        toast.error('Failed to load calendar data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Calendar helper functions
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const renderCalendarDays = () => {
    const days = [];
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border-t border-l p-1"></div>);
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isToday = new Date().toDateString() === date.toDateString();
      const isSelected = selectedDay?.toDateString() === date.toDateString();
      
      // Find events for this day
      const dayEvents = events.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.getDate() === day && 
               eventDate.getMonth() === month && 
               eventDate.getFullYear() === year;
      });
      
      days.push(
        <div 
          key={day} 
          className={`h-24 border-t border-l p-1 ${isToday ? 'bg-blue-50' : ''} ${isSelected ? 'ring-2 ring-primary ring-inset' : ''}`}
          onClick={() => setSelectedDay(date)}
        >
          <div className="flex justify-between">
            <span className={`text-sm font-medium ${isToday ? 'text-primary' : ''}`}>{day}</span>
            {dayEvents.length > 0 && (
              <span className="text-xs px-1.5 py-0.5 bg-primary text-white rounded-full">
                {dayEvents.length}
              </span>
            )}
          </div>
          <div className="mt-1 space-y-1 overflow-y-auto max-h-16">
            {dayEvents.map(event => (
              <div 
                key={event.id} 
                className="text-xs p-1 rounded bg-primary/10 text-primary truncate cursor-pointer hover:bg-primary/20"
                onClick={(e) => {
                  e.stopPropagation();
                  toast.info(`Event: ${event.title}`);
                }}
              >
                {event.title}
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    return days;
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const monthName = currentMonth.toLocaleString('default', { month: 'long' });
  const year = currentMonth.getFullYear();

  return (
    <SidebarProvider>
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                className="mr-2 p-0 h-auto" 
                onClick={() => navigate('/admin-dashboard')}
              >
                <span className="text-primary">&larr;</span>
              </Button>
              <h1 className="text-2xl font-bold">Calendar</h1>
            </div>
            <p className="text-gray-500 mt-1">Schedule and manage appointments with leads</p>
          </div>
          
          <Button>
            <Plus size={16} className="mr-2" />
            New Event
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                <div className="flex items-center">
                  <CalendarIcon size={20} className="mr-2" />
                  {monthName} {year}
                </div>
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon" onClick={prevMonth}>
                  <ChevronLeft size={16} />
                </Button>
                <Button variant="outline" size="icon" onClick={nextMonth}>
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="grid grid-cols-7 gap-px bg-gray-200">
                {Array(35).fill(0).map((_, i) => (
                  <div key={i} className="h-24 bg-white animate-pulse"></div>
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-7 text-center font-medium text-sm py-2">
                  <div>Sun</div>
                  <div>Mon</div>
                  <div>Tue</div>
                  <div>Wed</div>
                  <div>Thu</div>
                  <div>Fri</div>
                  <div>Sat</div>
                </div>
                <div className="grid grid-cols-7 border-r border-b">
                  {renderCalendarDays()}
                </div>
              </>
            )}
          </CardContent>
        </Card>
        
        {selectedDay && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>
                Events for {selectedDay.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {events.filter(event => {
                const eventDate = new Date(event.date);
                return eventDate.toDateString() === selectedDay.toDateString();
              }).length > 0 ? (
                <div className="space-y-4">
                  {events
                    .filter(event => {
                      const eventDate = new Date(event.date);
                      return eventDate.toDateString() === selectedDay.toDateString();
                    })
                    .map(event => (
                      <div key={event.id} className="flex items-center p-4 border rounded-lg hover:bg-gray-50">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-4">
                          <Clock size={16} />
                        </div>
                        <div>
                          <h3 className="font-medium">{event.title}</h3>
                          <p className="text-sm text-gray-500">
                            {new Date(event.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </p>
                        </div>
                        <div className="ml-auto">
                          <span className="text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                            {event.type}
                          </span>
                        </div>
                      </div>
                    ))
                  }
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No events scheduled for this day.</p>
                  <Button className="mt-4">
                    <Plus size={16} className="mr-2" />
                    Add Event
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </SidebarProvider>
  );
};

export default AdminCalendar;
