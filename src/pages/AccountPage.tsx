
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart, Clock, User } from 'lucide-react';

export default function AccountPage() {
  const [isLoggedIn] = useState(false);

  if (!isLoggedIn) {
    // Redirect to login or show login form
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
          <TabsList className="grid w-full grid-cols-4">
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
                    <Input placeholder="Your name" defaultValue="John Doe" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Email</label>
                    <Input placeholder="Email" defaultValue="john@example.com" type="email" disabled />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Phone</label>
                    <Input placeholder="Phone number" defaultValue="+91 9876543210" />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Delivery Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium mb-2 block">Street Address</label>
                      <Input placeholder="Street address" defaultValue="123 Main Street" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">City</label>
                      <Input placeholder="City" defaultValue="Mumbai" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">State</label>
                      <Input placeholder="State" defaultValue="Maharashtra" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Postal Code</label>
                      <Input placeholder="PIN code" defaultValue="400001" />
                    </div>
                  </div>
                </div>
                
                <Button className="bg-cutebae-coral hover:bg-opacity-90">
                  Save Changes
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
                  {/* Example order */}
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-medium">Order #CUT12345</h3>
                        <p className="text-sm text-gray-600">Placed on May 10, 2023</p>
                      </div>
                      <div>
                        <span className="inline-block bg-green-100 text-green-800 px-3 py-1 text-xs rounded-full">
                          Delivered
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center mb-4">
                      <div className="col-span-2">
                        <div className="flex items-center">
                          <div className="w-16 h-16 bg-gray-200 rounded">
                            <img src="/placeholder.svg" alt="Product" className="w-full h-full object-cover" />
                          </div>
                          <div className="ml-4">
                            <h4 className="text-sm font-medium">Cotton T-Shirt</h4>
                            <p className="text-xs text-gray-600">Size: 2-3Y, Color: Pink</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-center">
                        <span className="text-sm">Qty: 1</span>
                      </div>
                      <div className="text-center">
                        <span className="font-medium">₹599</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center border-t pt-3">
                      <span className="text-sm font-medium">Total: ₹599</span>
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                  </div>
                  
                  {/* Add more example orders if needed */}
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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {/* Example wishlist item */}
                  <div className="border rounded-lg overflow-hidden group">
                    <div className="aspect-square relative bg-gray-100">
                      <img 
                        src="/placeholder.svg" 
                        alt="Product" 
                        className="w-full h-full object-cover object-center"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Button className="bg-white text-cutebae-coral hover:bg-cutebae-coral hover:text-white">
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-sm">Floral Print Dress</h3>
                      <p className="text-cutebae-coral font-medium mt-1">₹899</p>
                    </div>
                  </div>
                  
                  {/* Add more wishlist items as needed */}
                </div>
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
                  {/* Example cart item */}
                  <div className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center">
                      <div className="w-16 h-16 bg-gray-200 rounded">
                        <img src="/placeholder.svg" alt="Product" className="w-full h-full object-cover" />
                      </div>
                      <div className="ml-4">
                        <h4 className="text-sm font-medium">Boys Denim Shorts</h4>
                        <p className="text-xs text-gray-600">Size: 4-5Y, Color: Blue</p>
                        <div className="flex items-center mt-1">
                          <Button variant="outline" size="icon" className="h-6 w-6 rounded-full p-0">-</Button>
                          <span className="mx-2 text-sm">1</span>
                          <Button variant="outline" size="icon" className="h-6 w-6 rounded-full p-0">+</Button>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-medium">₹499</span>
                      <Button variant="ghost" size="sm" className="text-gray-500 mt-1">Remove</Button>
                    </div>
                  </div>
                  
                  {/* Add more cart items as needed */}
                  
                  <div className="flex justify-between pt-4 border-t">
                    <span className="font-medium">Total</span>
                    <span className="font-bold text-cutebae-coral">₹499</span>
                  </div>
                  
                  <Button className="w-full bg-cutebae-coral hover:bg-opacity-90">
                    Checkout
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
