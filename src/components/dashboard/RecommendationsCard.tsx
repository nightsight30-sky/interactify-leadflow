
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const RecommendationsCard = () => {
  return (
    <div className="mt-12">
      <Card>
        <CardHeader>
          <CardTitle>AI Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg bg-blue-50/50">
              <h3 className="font-medium mb-2">Product Suggestion</h3>
              <p className="text-sm text-gray-600">Based on your recent inquiries, you might be interested in our Advanced Analytics package.</p>
            </div>
            <div className="p-4 border rounded-lg bg-blue-50/50">
              <h3 className="font-medium mb-2">Upcoming Webinar</h3>
              <p className="text-sm text-gray-600">Join our webinar on "Maximizing Lead Conversion" next Tuesday at 2 PM EST.</p>
              <Button variant="outline" size="sm" className="mt-2">
                Register Now
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecommendationsCard;
