
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ChevronRight, RefreshCcw } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useStore } from '@/contexts/StoreContext';
import { useAuth } from '@/contexts/AuthContext';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useStore();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState('');
  
  const subtotal = getCartTotal();
  const shippingCost = subtotal > 1000 ? 0 : 99;
  const total = subtotal + shippingCost;
  
  const handleQuantityChange = (productId: string, newQuantity: number) => {
    updateQuantity(productId, newQuantity);
  };
  
  const handleRemoveItem = (productId: string) => {
    removeFromCart(productId);
  };
  
  const handleCheckout = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    navigate('/checkout');
  };
  
  if (cart.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto">
            <ShoppingBag className="w-16 h-16 mx-auto text-gray-400" />
            <h2 className="text-3xl font-bold mt-4 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Looks like you haven't added any products to your cart yet.</p>
            <Link to="/products">
              <Button className="bg-cutebae-coral hover:bg-opacity-90">
                Browse Products
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {cart.map((item) => (
                <div key={item.product.id} className="flex gap-4 border-b pb-6">
                  <div className="w-24 h-24 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                    <img 
                      src={item.product.image} 
                      alt={item.product.name} 
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{item.product.name}</h3>
                      <p className="font-bold text-cutebae-coral">₹{Math.round(item.product.price * 83 * item.quantity)}</p>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{item.product.category}</p>
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center border rounded">
                        <button 
                          onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)} 
                          className="px-3 py-1 border-r"
                        >
                          -
                        </button>
                        <span className="px-4 py-1">{item.quantity}</span>
                        <button 
                          onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)} 
                          className="px-3 py-1 border-l"
                        >
                          +
                        </button>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleRemoveItem(item.product.id)} // Fixed parameters
                        className="text-gray-500 hover:text-red-500"
                      >
                        <Trash2 size={16} />
                        <span className="ml-1">Remove</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between mt-8">
              <Button 
                variant="outline" 
                onClick={() => navigate('/products')}
                className="flex items-center"
              >
                <RefreshCcw size={16} className="mr-2" />
                Continue Shopping
              </Button>
              <Button 
                variant="outline" 
                onClick={() => clearCart()} // Fixed parameters
                className="text-gray-500"
              >
                Clear Cart
              </Button>
            </div>
          </div>
          
          <div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{Math.round(subtotal * 83)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? 'Free' : `₹${shippingCost}`}</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold">
                  <span>Total</span>
                  <span>₹{Math.round(total * 83)}</span>
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="coupon" className="block text-sm mb-2">Coupon Code</label>
                <div className="flex">
                  <Input 
                    id="coupon" 
                    value={coupon} 
                    onChange={(e) => setCoupon(e.target.value)} 
                    placeholder="Enter coupon code"
                    className="rounded-r-none"
                  />
                  <Button className="rounded-l-none">Apply</Button>
                </div>
              </div>
              
              <Button 
                onClick={handleCheckout}
                className="w-full bg-cutebae-coral hover:bg-opacity-90"
                size="lg"
              >
                Checkout
                <ChevronRight size={16} className="ml-2" />
              </Button>
              
              <p className="text-center text-xs text-gray-500 mt-4">
                Shipping calculated at checkout. Payment options available on next step.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
