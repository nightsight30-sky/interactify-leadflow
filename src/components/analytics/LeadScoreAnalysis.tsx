
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lead } from "@/utils/leadsService";
import { Brain, BarChart, Lightbulb } from "lucide-react";

interface LeadScoreAnalysisProps {
  lead: Lead;
}

const LeadScoreAnalysis = ({ lead }: LeadScoreAnalysisProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-amber-600";
    if (score >= 40) return "text-blue-600";
    return "text-gray-600";
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return "bg-green-50";
    if (score >= 60) return "bg-amber-50";
    if (score >= 40) return "bg-blue-50";
    return "bg-gray-50";
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Brain size={18} className="text-primary" />
          AI Lead Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Lead Score:</span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${getScoreColor(
                lead.score
              )} ${getScoreBackground(lead.score)}`}
            >
              <BarChart size={16} className="mr-1" />
              {lead.score}/100
            </span>
          </div>

          {lead.analysis ? (
            <div className="p-3 bg-primary/5 rounded-md">
              <div className="flex items-start">
                <Lightbulb size={16} className="text-primary mr-2 mt-0.5" />
                <p className="text-sm">{lead.analysis}</p>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500 italic">
              No detailed analysis available for this lead.
            </div>
          )}

          {lead.score >= 70 && (
            <div className="p-3 bg-amber-50 rounded-md">
              <p className="text-sm text-amber-700">
                <strong>High-value lead:</strong> This lead has a high likelihood of conversion and should be prioritized.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LeadScoreAnalysis;
