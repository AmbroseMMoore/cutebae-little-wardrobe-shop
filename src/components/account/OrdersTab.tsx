
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

export default function OrdersTab() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchOrders = async () => {
      if (user) {
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (!orderError) {
          setOrders(orderData || []);
        }
      }
    };
    
    fetchOrders();
  }, [user]);

  return (
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
  );
}
