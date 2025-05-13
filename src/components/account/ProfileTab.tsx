
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { updateUserProfile } from '@/lib/auth';
import { useToast } from '@/components/ui/use-toast';

export default function ProfileTab() {
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  
  const [name, setName] = useState(profile?.name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [street, setStreet] = useState(profile?.address || '');
  const [city, setCity] = useState(profile?.city || '');
  const [state, setState] = useState(profile?.state || '');
  const [pincode, setPincode] = useState(profile?.pincode || '');
  const [isSaving, setIsSaving] = useState(false);
  
  // Update state when profile changes
  React.useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setPhone(profile.phone || '');
      setStreet(profile.address || '');
      setCity(profile.city || '');
      setState(profile.state || '');
      setPincode(profile.pincode || '');
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setIsSaving(true);
    
    try {
      await updateUserProfile(user.id, {
        name,
        phone,
        address: street,
        city,
        state,
        pincode
      });
      
      await refreshProfile();
      
      toast({
        title: 'Profile Updated',
        description: 'Your profile information has been saved successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>
          Update your account details and preferences.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Full Name</label>
            <Input 
              placeholder="Your name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Email</label>
            <Input 
              placeholder="Email" 
              value={user?.email || ''} 
              type="email" 
              disabled 
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Phone</label>
            <Input 
              placeholder="Phone number" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
            />
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-3">Delivery Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-sm font-medium mb-2 block">Street Address</label>
              <Input 
                placeholder="Street address" 
                value={street} 
                onChange={(e) => setStreet(e.target.value)} 
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">City</label>
              <Input 
                placeholder="City" 
                value={city} 
                onChange={(e) => setCity(e.target.value)} 
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">State</label>
              <Input 
                placeholder="State" 
                value={state} 
                onChange={(e) => setState(e.target.value)} 
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Postal Code</label>
              <Input 
                placeholder="PIN code" 
                value={pincode} 
                onChange={(e) => setPincode(e.target.value)} 
              />
            </div>
          </div>
        </div>
        
        <Button 
          className="bg-cutebae-coral hover:bg-opacity-90"
          onClick={handleSaveProfile}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </CardContent>
    </Card>
  );
}
