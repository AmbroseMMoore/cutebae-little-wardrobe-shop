
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart, Clock, User, Package, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { updateUserProfile } from '@/lib/auth';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

export default function AccountPage() {
  const { user, profile, isLoading, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  const [orders, setOrders] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  
  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setPhone(profile.phone || '');
      setStreet(profile.address || '');
      setCity(profile.city || '');
      setState(profile.state || '');
      setPincode(profile.pincode || '');
    }
  }, [profile]);
  
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        // Fetch orders
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (!orderError) {
          setOrders(orderData || []);
        }
        
        // Fetch wishlist
        const { data: wishlistData, error: wishlistError } = await supabase
          .from('wishlist')
          .select('*, product:product_id(*)')
          .eq('user_id', user.id);
          
        if (!wishlistError) {
          setWishlist(wishlistData || []);
        }
      }
    };
    
    fetchUserData();
  }, [user]);

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

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-8"></div>
            <div className="h-64 bg-gray-200 rounded-lg max-w-3xl mx-auto"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Please Sign In</h2>
          <p className="mb-6">You need to be signed in to view your account details.</p>
          <Button asChild>
            <a href="/login">Sign In</a>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">My Account</h1>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User size={16} /> Profile
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <Clock size={16} /> Orders
            </TabsTrigger>
            <TabsTrigger value="wishlist" className="flex items-center gap-2">
              <Heart size={16} /> Wishlist
            </TabsTrigger>
            <TabsTrigger value="cart" className="flex items-center gap-2">
              <ShoppingCart size={16} /> Cart
            </TabsTrigger>
            <TabsTrigger value="returns" className="flex items-center gap-2">
              <X size={16} /> Returns
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
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
          </TabsContent>
          
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Your Orders</CardTitle>
                <CardDescription>
                  View and track your recent orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {orders.length > 0 ? (
                    orders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-medium">Order #{order.order_number}</h3>
                            <p className="text-sm text-gray-600">
                              Placed on {new Date(order.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <span className={`inline-block px-3 py-1 text-xs rounded-full ${
                              order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                              order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </div>
                        </div>
                        
                        {order.order_items && order.order_items.map((item: any) => (
                          <div key={item.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center mb-4">
                            <div className="col-span-2">
                              <div className="flex items-center">
                                <div className="w-16 h-16 bg-gray-200 rounded">
                                  <img src={item.product_image || "/placeholder.svg"} alt={item.product_name} className="w-full h-full object-cover" />
                                </div>
                                <div className="ml-4">
                                  <h4 className="text-sm font-medium">{item.product_name}</h4>
                                  <p className="text-xs text-gray-600">
                                    Size: {item.size}, Color: {item.color}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="text-center">
                              <span className="text-sm">Qty: {item.quantity}</span>
                            </div>
                            <div className="text-center">
                              <span className="font-medium">₹{item.price}</span>
                            </div>
                          </div>
                        ))}
                        
                        {order.status === 'shipped' && (
                          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                            <h4 className="text-sm font-medium mb-2">Tracking Information</h4>
                            <p className="text-sm">Tracking ID: {order.tracking_id || 'N/A'}</p>
                            <p className="text-sm">Courier: {order.courier || 'N/A'}</p>
                          </div>
                        )}
                        
                        <div className="flex justify-between items-center border-t pt-3">
                          <span className="text-sm font-medium">Total: ₹{order.total_amount}</span>
                          <Button variant="outline" size="sm">View Details</Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Package className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                      <h3 className="text-lg font-medium mb-1">No orders yet</h3>
                      <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
                      <Button asChild className="bg-cutebae-coral">
                        <a href="/">Start Shopping</a>
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="wishlist">
            <Card>
              <CardHeader>
                <CardTitle>Your Wishlist</CardTitle>
                <CardDescription>
                  Items you've saved for later
                </CardDescription>
              </CardHeader>
              <CardContent>
                {wishlist.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {wishlist.map((item) => (
                      <div key={item.id} className="border rounded-lg overflow-hidden group">
                        <div className="aspect-square relative bg-gray-100">
                          <img 
                            src={item.product?.image || "/placeholder.svg"} 
                            alt={item.product?.name} 
                            className="w-full h-full object-cover object-center"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <Button className="bg-white text-cutebae-coral hover:bg-cutebae-coral hover:text-white">
                              Add to Cart
                            </Button>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-medium text-sm">{item.product?.name}</h3>
                          <p className="text-cutebae-coral font-medium mt-1">₹{item.product?.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Heart className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                    <h3 className="text-lg font-medium mb-1">Your wishlist is empty</h3>
                    <p className="text-gray-500 mb-4">Add items to your wishlist to save them for later.</p>
                    <Button asChild className="bg-cutebae-coral">
                      <a href="/">Browse Products</a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="cart">
            <Card>
              <CardHeader>
                <CardTitle>Your Cart</CardTitle>
                <CardDescription>
                  Items currently in your shopping cart
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* This will use the existing cart from StoreContext */}
                  <Button asChild className="w-full bg-cutebae-coral hover:bg-opacity-90">
                    <a href="/cart">Go to Cart</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="returns">
            <Card>
              <CardHeader>
                <CardTitle>Returns & Cancellations</CardTitle>
                <CardDescription>
                  Manage your returns and cancellations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <X className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                  <h3 className="text-lg font-medium mb-1">No returns or cancellations</h3>
                  <p className="text-gray-500 mb-4">You don't have any pending returns or cancellations.</p>
                  <p className="text-sm text-gray-600 max-w-md mx-auto">
                    If you need to return or cancel an order, please visit the order details page or contact our customer support.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
