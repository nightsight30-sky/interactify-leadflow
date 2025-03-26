
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import LeadInsightCard from '@/components/ai/LeadInsightCard';
import { toast } from 'sonner';
import { Brain, MessageSquare, TrendingUp, UserPlus, LineChart } from 'lucide-react';

const mockInsights = [
  {
    id: 1,
    title: "Lead Response Time Analysis",
    content: "Your team's average response time to high-value leads has increased to 3.5 hours. Consider setting up auto-responses and routing to improve initial engagement.",
    icon: <TrendingUp />,
    actionLabel: "Optimize Response Time",
    type: "lead-analysis"
  },
  {
    id: 2,
    title: "Message Tone Optimization",
    content: "Analysis of your most successful conversions shows that messages with a friendly yet professional tone perform 32% better than formal communications.",
    icon: <MessageSquare />,
    actionLabel: "Review Message Templates",
    type: "message-analysis"
  },
  {
    id: 3,
    title: "Lead Qualification Patterns",
    content: "Leads from social media channels show higher intent but lower conversion rates. They may benefit from more educational content before sales outreach.",
    icon: <UserPlus />,
    actionLabel: "Adjust Lead Nurturing",
    type: "lead-analysis"
  },
  {
    id: 4,
    title: "Conversion Rate Improvement",
    content: "Leads that receive a personalized follow-up within 24 hours are 40% more likely to convert. Consider automating first follow-ups for all new leads.",
    icon: <LineChart />,
    actionLabel: "Implement Follow-up Strategy",
    type: "conversion"
  },
  {
    id: 5,
    title: "Topic Interest Analysis",
    content: "Leads are showing increased interest in integration capabilities. Consider creating targeted content about your API and integration options.",
    icon: <Brain />,
    actionLabel: "Create Content Strategy",
    type: "recommendation"
  },
  {
    id: 6,
    title: "Lead Source Effectiveness",
    content: "Your Google Ads campaign is generating leads at a 28% lower cost compared to other channels. Consider increasing budget allocation to this channel.",
    icon: <TrendingUp />,
    actionLabel: "Adjust Marketing Budget",
    type: "performance"
  }
];

const AIInsights = () => {
  const [activeTab, setActiveTab] = useState('all-insights');
  const [isGenerating, setIsGenerating] = useState(false);

  const getFilteredInsights = () => {
    switch (activeTab) {
      case 'lead-analysis':
        return mockInsights.filter(insight => insight.type === 'lead-analysis');
      case 'message-analysis':
        return mockInsights.filter(insight => insight.type === 'message-analysis');
      case 'recommendations':
        return mockInsights.filter(insight => insight.type === 'recommendation');
      case 'performance':
        return mockInsights.filter(insight => 
          insight.type === 'performance' || insight.type === 'conversion');
      default:
        return mockInsights;
    }
  };

  const handleGenerateInsights = () => {
    setIsGenerating(true);
    
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 2500)),
      {
        loading: 'Analyzing lead data...',
        success: 'AI analysis complete! New insights generated.',
        error: 'Error generating insights',
      }
    ).finally(() => setIsGenerating(false));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-1">AI-Powered Insights</h2>
          <p className="text-gray-500">Data-driven recommendations to improve lead management</p>
        </div>
        
        <div className="mt-4 sm:mt-0">
          <Button 
            onClick={handleGenerateInsights} 
            disabled={isGenerating}
          >
            <Brain className="mr-2 h-4 w-4" />
            {isGenerating ? 'Generating...' : 'Generate New Insights'}
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all-insights" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
          <TabsTrigger value="all-insights">All Insights</TabsTrigger>
          <TabsTrigger value="lead-analysis">Lead Analysis</TabsTrigger>
          <TabsTrigger value="message-analysis">Message Analysis</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                {activeTab === 'all-insights' && 'All AI Insights'}
                {activeTab === 'lead-analysis' && 'Lead Analysis Insights'}
                {activeTab === 'message-analysis' && 'Message Analysis Insights'}
                {activeTab === 'recommendations' && 'AI Recommendations'}
                {activeTab === 'performance' && 'Performance Insights'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getFilteredInsights().map(insight => (
                  <LeadInsightCard 
                    key={insight.id} 
                    insight={insight}
                  />
                ))}
              </div>
              
              {getFilteredInsights().length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No insights available for this category.</p>
                  <Button variant="outline" className="mt-4" onClick={handleGenerateInsights}>
                    Generate New Insights
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIInsights;
