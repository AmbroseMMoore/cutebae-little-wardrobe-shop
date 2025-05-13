
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import Layout from '@/components/layout/Layout';
import { useStore } from '@/contexts/StoreContext';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useStore();
  
  if (cart.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="mb-8">Looks like you haven't added any products to your cart yet.</p>
          <Button asChild className="bg-cutebae-coral hover:bg-opacity-90">
            <Link to="/">Start Shopping</Link>
          </Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="hidden md:flex justify-between text-sm font-medium text-gray-500 pb-4 mb-4 border-b">
                <div className="w-1/2">Product</div>
                <div className="w-1/4 text-center">Quantity</div>
                <div className="w-1/4 text-right">Total</div>
              </div>
              
              {cart.map(item => (
                <div key={item.product.id} className="py-4 border-b last:border-0">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    {/* Product */}
                    <div className="flex items-center mb-4 md:mb-0 md:w-1/2">
                      <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden">
                        <img 
                          src={item.product.image} 
                          alt={item.product.name} 
                          className="w-full h-full object-cover object-center"
                        />
                      </div>
                      <div className="ml-4">
                        <h3 className="font-medium">
                          <Link 
                            to={`/product/${item.product.id}`}
                            className="hover:text-cutebae-coral"
                          >
                            {item.product.name}
                          </Link>
                        </h3>
                        <p className="text-sm text-gray-600">{item.product.category} · {item.product.ageGroup}</p>
                        <p className="text-cutebae-coral font-medium md:hidden mt-1">
                          ${item.product.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    
                    {/* Quantity */}
                    <div className="flex items-center md:w-1/4 md:justify-center">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="h-8 w-8 rounded-full"
                      >
                        <Minus size={14} />
                      </Button>
                      <span className="w-10 text-center">{item.quantity}</span>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="h-8 w-8 rounded-full"
                      >
                        <Plus size={14} />
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => removeFromCart(item.product.id)}
                        className="ml-4 text-gray-500 hover:text-red-500"
                      >
                        <Trash2 size={18} />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </div>
                    
                    {/* Total */}
                    <div className="md:w-1/4 md:text-right mt-2 md:mt-0">
                      <p className="font-semibold">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="mt-6 text-right">
                <Button 
                  variant="ghost"
                  onClick={clearCart}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Clear Cart
                </Button>
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>{cartTotal >= 50 ? "Free" : "$5.99"}</span>
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-cutebae-coral">
                    ${(cartTotal + (cartTotal >= 50 ? 0 : 5.99)).toFixed(2)}
                  </span>
                </div>
              </div>
              
              <Button 
                className="w-full mt-6 bg-cutebae-coral hover:bg-opacity-90"
              >
                Checkout <ArrowRight size={16} className="ml-2" />
              </Button>
              
              <div className="mt-6 text-sm text-gray-600">
                <p className="mb-2">✨ Free shipping on orders over $50</p>
                <p>🔒 Secure checkout</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
