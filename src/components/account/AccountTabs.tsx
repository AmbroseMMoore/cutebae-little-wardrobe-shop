
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart, Heart, Clock, User, Package, X } from 'lucide-react';
import ProfileTab from './ProfileTab';
import OrdersTab from './OrdersTab';
import WishlistTab from './WishlistTab';
import CartTab from './CartTab';
import ReturnsTab from './ReturnsTab';

export default function AccountTabs() {
  return (
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
        <ProfileTab />
      </TabsContent>
      
      <TabsContent value="orders">
        <OrdersTab />
      </TabsContent>
      
      <TabsContent value="wishlist">
        <WishlistTab />
      </TabsContent>
      
      <TabsContent value="cart">
        <CartTab />
      </TabsContent>
      
      <TabsContent value="returns">
        <ReturnsTab />
      </TabsContent>
    </Tabs>
  );
}
