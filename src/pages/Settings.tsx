
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { SidebarProvider, Sidebar, SidebarContent, SidebarTrigger } from '@/components/ui/sidebar';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Home, User, Settings, Bell, LogOut, Shield, CreditCard,
  Lock, Globe, Bell as BellIcon, MessageSquare
} from 'lucide-react';
import { toast } from 'sonner';

const SettingsPage = () => {
  const navigate = useNavigate();
  const [activeMainTab, setActiveMainTab] = useState('account');
  
  const handleLogout = () => {
    toast.success('Successfully logged out');
    navigate('/login');
  };
  
  const handleSaveSettings = () => {
    toast.success('Settings saved successfully');
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full page-transition">
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
              <Button 
                variant="ghost" 
                className="w-full justify-start" 
                onClick={() => navigate('/user-dashboard')}
              >
                <Home size={18} className="mr-2" />
                Dashboard
              </Button>
              <Button 
                variant="default" 
                className="w-full justify-start"
              >
                <Settings size={18} className="mr-2" />
                Settings
              </Button>
            </div>
            
            <div className="absolute bottom-4 left-4 right-4">
              <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50" onClick={handleLogout}>
                <LogOut size={18} className="mr-2" />
                Logout
              </Button>
            </div>
          </SidebarContent>
        </Sidebar>
        
        <div className="flex-1">
          <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <SidebarTrigger />
                <h1 className="text-xl font-semibold ml-4">Settings</h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Bell size={20} className="text-gray-500" />
                  <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary"></span>
                </div>
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                  US
                </div>
              </div>
            </div>
          </header>
          
          <main className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold mb-1">Account Settings</h2>
                <p className="text-gray-500">Manage your account preferences and settings</p>
              </div>
            </div>
            
            <Tabs value={activeMainTab} onValueChange={setActiveMainTab} className="mb-8">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="account">
                  <User size={16} className="mr-2" />
                  Account
                </TabsTrigger>
                <TabsTrigger value="security">
                  <Shield size={16} className="mr-2" />
                  Security
                </TabsTrigger>
                <TabsTrigger value="notifications">
                  <BellIcon size={16} className="mr-2" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="billing">
                  <CreditCard size={16} className="mr-2" />
                  Billing
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="account" className="mt-6 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" placeholder="John Doe" defaultValue="John Doe" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" placeholder="john@example.com" defaultValue="john@example.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" placeholder="+1 (555) 000-0000" defaultValue="+1 (555) 000-0000" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company">Company</Label>
                        <Input id="company" placeholder="Your Company" defaultValue="Acme Inc." />
                      </div>
                    </div>
                    <Button onClick={handleSaveSettings}>Save Changes</Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Picture</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-medium">
                        JD
                      </div>
                      <div>
                        <Button size="sm">Upload New Picture</Button>
                        <p className="text-sm text-gray-500 mt-1">PNG, JPG or GIF, max 2MB</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="security" className="mt-6 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input id="current-password" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input id="confirm-password" type="password" />
                      </div>
                    </div>
                    <Button onClick={() => toast.success('Password changed successfully')}>Update Password</Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Two-Factor Authentication</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Enable Two-Factor Authentication</p>
                        <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                      </div>
                      <Switch defaultChecked id="two-factor" />
                    </div>
                    <Button variant="outline">Configure 2FA</Button>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="notifications" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Email Notifications</p>
                          <p className="text-sm text-gray-500">Receive lead updates via email</p>
                        </div>
                        <Switch defaultChecked id="email-notifications" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">SMS Notifications</p>
                          <p className="text-sm text-gray-500">Receive important alerts via SMS</p>
                        </div>
                        <Switch id="sms-notifications" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Browser Notifications</p>
                          <p className="text-sm text-gray-500">Show desktop notifications</p>
                        </div>
                        <Switch defaultChecked id="browser-notifications" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">WhatsApp Notifications</p>
                          <p className="text-sm text-gray-500">Receive lead updates via WhatsApp</p>
                        </div>
                        <Switch id="whatsapp-notifications" />
                      </div>
                    </div>
                    <Button onClick={handleSaveSettings}>Save Preferences</Button>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="billing" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Billing Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Free Plan</p>
                          <p className="text-sm text-gray-500">Basic lead management features</p>
                        </div>
                        <Button variant="outline" onClick={() => navigate('/pricing')}>Upgrade Plan</Button>
                      </div>
                    </div>
                    
                    <div>
                      <p className="font-medium mb-2">Payment Methods</p>
                      <div className="rounded-lg border p-4 flex items-center justify-between">
                        <p className="text-sm text-gray-500">No payment methods added yet</p>
                        <Button variant="outline" size="sm">Add Payment Method</Button>
                      </div>
                    </div>
                    
                    <div>
                      <p className="font-medium mb-2">Billing History</p>
                      <div className="rounded-lg border p-4 flex items-center justify-center py-8">
                        <p className="text-sm text-gray-500">No billing history available</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default SettingsPage;
