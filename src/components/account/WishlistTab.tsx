
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

export default function WishlistTab() {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchWishlist = async () => {
      if (user) {
        const { data: wishlistData, error: wishlistError } = await supabase
          .from('wishlist')
          .select('*, product:product_id(*)')
          .eq('user_id', user.id);
          
        if (!wishlistError) {
          setWishlist(wishlistData || []);
        }
      }
    };
    
    fetchWishlist();
  }, [user]);

  return (
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
  );
}
