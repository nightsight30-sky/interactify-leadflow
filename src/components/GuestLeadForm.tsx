
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { leadsService } from '@/utils/leadsService';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const GuestLeadForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    requestType: 'Product Inquiry',
    message: '',
    status: 'new' as const,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await leadsService.addLead(formData);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        requestType: 'Product Inquiry',
        message: '',
        status: 'new',
      });
      
      toast.success('Your request has been submitted successfully!');
    } catch (error) {
      console.error('Error submitting request:', error);
      toast.error('Failed to submit your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h3 className="text-lg font-semibold mb-4">Get in Touch</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="guest-name">Full Name</Label>
            <Input
              id="guest-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="guest-email">Email</Label>
            <Input
              id="guest-email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="guest-requestType">Request Type</Label>
          <Select 
            value={formData.requestType} 
            onValueChange={(value) => handleSelectChange('requestType', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select request type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Product Inquiry">Product Inquiry</SelectItem>
              <SelectItem value="Demo Request">Demo Request</SelectItem>
              <SelectItem value="Support">Support</SelectItem>
              <SelectItem value="Pricing">Pricing</SelectItem>
              <SelectItem value="Feedback">Feedback</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="guest-message">Message</Label>
          <Textarea
            id="guest-message"
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            required
            placeholder="Please describe your request in detail..."
          />
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Request'
          )}
        </Button>
      </form>
    </div>
  );
};

export default GuestLeadForm;
