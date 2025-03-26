
import { Button } from '@/components/ui/button';
import { Sidebar, SidebarContent } from '@/components/ui/sidebar';
import { Home, MessageSquare, Mail, User, Settings, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardSidebarProps {
  onLogout: () => void;
}

const DashboardSidebar = ({ onLogout }: DashboardSidebarProps) => {
  return (
    <Sidebar className="border-r">
      <div className="p-4 border-b">
        <Link to="/" className="flex items-center">
          <span className="text-xl font-semibold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            LeadFlow
          </span>
        </Link>
      </div>
      
      <SidebarContent className="p-2">
        <div className="space-y-1">
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link to="/user-dashboard">
              <Home size={18} className="mr-2" />
              Dashboard
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <MessageSquare size={18} className="mr-2" />
            Messages
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Mail size={18} className="mr-2" />
            Email History
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <User size={18} className="mr-2" />
            Profile
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Settings size={18} className="mr-2" />
            Settings
          </Button>
        </div>
        
        <div className="absolute bottom-4 left-4 right-4">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50" 
            onClick={onLogout}
          >
            <LogOut size={18} className="mr-2" />
            Logout
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export default DashboardSidebar;
