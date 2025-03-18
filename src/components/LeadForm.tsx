
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send } from 'lucide-react';
import { leadsService } from '@/utils/leadsService';
import { toast } from "sonner";

const requestTypes = [
  { value: 'Product Inquiry', label: 'Product Inquiry' },
  { value: 'Support', label: 'Support Request' },
  { value: 'Demo Request', label: 'Request Demo' },
  { value: 'Pricing', label: 'Pricing Information' },
  { value: 'Feedback', label: 'Feedback' }
];

const LeadForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    requestType: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, requestType: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.email || !formData.requestType || !formData.message) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Use the leadsService to add the lead
      await leadsService.addLead({
        name: formData.name,
        email: formData.email,
        requestType: formData.requestType,
        message: formData.message,
        status: 'new'
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        requestType: '',
        message: ''
      });
      
      toast({
        title: "Request submitted",
        description: "We'll get back to you soon!",
      });
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-6 sm:p-8">
      <h3 className="text-xl font-semibold mb-6">Send Us a Request</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="requestType">Request Type</Label>
          <Select value={formData.requestType} onValueChange={handleSelectChange} required>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select request type" />
            </SelectTrigger>
            <SelectContent>
              {requestTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            name="message"
            placeholder="Tell us how we can help you..."
            value={formData.message}
            onChange={handleChange}
            required
            className="w-full min-h-[120px]"
          />
        </div>
        
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            <span className="flex items-center">
              Submit Request <Send size={16} className="ml-2" />
            </span>
          )}
        </Button>
      </form>
    </div>
  );
};

export default LeadForm;
