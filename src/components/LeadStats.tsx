
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, BarChartBig, Users, Zap } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    positive: boolean;
  };
}

const StatsCard = ({ title, value, description, icon, trend }: StatsCardProps) => (
  <Card className="overflow-hidden">
    <CardHeader className="flex flex-row items-center justify-between p-4 pb-2 space-y-0">
      <CardTitle className="text-sm font-medium text-gray-500">{title}</CardTitle>
      <div className="p-2 bg-primary/10 rounded-full">{icon}</div>
    </CardHeader>
    <CardContent className="p-4 pt-0">
      <div className="flex items-baseline">
        <p className="text-2xl font-bold">{value}</p>
        {trend && (
          <span className={`ml-2 text-xs font-medium ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.positive ? '+' : ''}{trend.value}
          </span>
        )}
      </div>
      <p className="text-xs text-gray-500 mt-1">{description}</p>
    </CardContent>
  </Card>
);

const LeadStats = () => {
  const stats = [
    {
      title: 'Total Leads',
      value: '452',
      description: 'All time leads captured',
      icon: <Users size={20} className="text-primary" />,
      trend: { value: '12%', positive: true }
    },
    {
      title: 'Qualified Leads',
      value: '128',
      description: 'Leads with score > 70',
      icon: <Zap size={20} className="text-primary" />,
      trend: { value: '8%', positive: true }
    },
    {
      title: 'Conversion Rate',
      value: '18.7%',
      description: 'Leads to customers',
      icon: <BarChartBig size={20} className="text-primary" />,
      trend: { value: '2.1%', positive: true }
    },
    {
      title: 'Avg. Lead Score',
      value: '64.5',
      description: 'Average AI score',
      icon: <LineChart size={20} className="text-primary" />,
      trend: { value: '3.2', positive: true }
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <StatsCard
          key={index}
          title={stat.title}
          value={stat.value}
          description={stat.description}
          icon={stat.icon}
          trend={stat.trend}
        />
      ))}
    </div>
  );
};

export default LeadStats;
