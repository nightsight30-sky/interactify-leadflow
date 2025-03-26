
import { Bell } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';

interface DashboardHeaderProps {
  title: string;
}

const DashboardHeader = ({ title }: DashboardHeaderProps) => {
  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <SidebarTrigger />
          <h1 className="text-xl font-semibold ml-4">{title}</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Bell size={20} className="text-gray-500" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary"></span>
          </div>
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
            JS
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
