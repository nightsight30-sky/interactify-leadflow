import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PlusCircle, Loader2 } from 'lucide-react';
import { leadsService } from '@/utils/leadsService';
import { toast } from 'sonner';

interface NewLeadFormProps {
  onLeadAdded: () => void;
}

const NewLeadForm = ({ onLeadAdded }: NewLeadFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    requestType: 'Product Inquiry',
    message: '',
    status: 'new' as const,
  });

  useEffect(() => {
    // Get the current user from the service
    const user = leadsService.getCurrentUser();
    setCurrentUser(user);
    
    // Pre-populate form with user data if available
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }));
    }
  }, []);

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
      await leadsService.addLead({
        ...formData,
        userId: currentUser?.id
      });
      
      onLeadAdded();
      
      // Reset form (keeping user info)
      setFormData({
        name: currentUser?.name || '',
        email: currentUser?.email || '',
        requestType: 'Product Inquiry',
        message: '',
        status: 'new',
      });
      
      toast.success('Your request has been submitted successfully!');
    } catch (error) {
      console.error('Error adding lead:', error);
      toast.error('Failed to submit your request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle size={16} className="mr-2" />
          New Request
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Submit New Request</DialogTitle>
          <DialogDescription>
            Please provide details about your request. Our team will respond as soon as possible.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="requestType">Request Type</Label>
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
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              name="message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              required
              placeholder="Please describe your request in detail..."
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Request'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewLeadForm;
