
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Truck, FileText, Eye } from 'lucide-react';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [shippingInfo, setShippingInfo] = useState({
    courier: '',
    trackingId: ''
  });
  const { toast } = useToast();
  
  useEffect(() => {
    fetchOrders();
  }, []);
  
  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id, 
          order_number, 
          status, 
          created_at, 
          total_amount, 
          user_id, 
          tracking_id, 
          courier,
          user_profiles (name, email, phone),
          order_items (
            id, 
            product_name, 
            product_id, 
            quantity, 
            price,
            size,
            color,
            product_code,
            product_image
          )
        `)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setOrders(data || []);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setShippingInfo({
      courier: order.courier || '',
      trackingId: order.tracking_id || ''
    });
  };
  
  const handleMarkAsShipped = async () => {
    if (!selectedOrder) return;
    
    if (!shippingInfo.courier || !shippingInfo.trackingId) {
      toast({
        title: 'Error',
        description: 'Please enter both courier name and tracking ID',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          status: 'shipped',
          courier: shippingInfo.courier,
          tracking_id: shippingInfo.trackingId,
          shipped_at: new Date().toISOString()
        })
        .eq('id', selectedOrder.id);
        
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: `Order #${selectedOrder.order_number} marked as shipped`,
      });
      
      // Update local state
      setOrders(orders.map(order => {
        if (order.id === selectedOrder.id) {
          return {
            ...order,
            status: 'shipped',
            courier: shippingInfo.courier,
            tracking_id: shippingInfo.trackingId
          };
        }
        return order;
      }));
      
      setSelectedOrder({
        ...selectedOrder,
        status: 'shipped',
        courier: shippingInfo.courier,
        tracking_id: shippingInfo.trackingId
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };
  
  const handleMarkAsDelivered = async () => {
    if (!selectedOrder) return;
    
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          status: 'delivered',
          delivered_at: new Date().toISOString()
        })
        .eq('id', selectedOrder.id);
        
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: `Order #${selectedOrder.order_number} marked as delivered`,
      });
      
      // Update local state
      setOrders(orders.map(order => {
        if (order.id === selectedOrder.id) {
          return {
            ...order,
            status: 'delivered'
          };
        }
        return order;
      }));
      
      setSelectedOrder({
        ...selectedOrder,
        status: 'delivered'
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };
  
  const closeOrderDetails = () => {
    setSelectedOrder(null);
  };
  
  // Filter orders by status
  const pendingOrders = orders.filter(order => order.status === 'processing');
  const shippedOrders = orders.filter(order => order.status === 'shipped');
  const deliveredOrders = orders.filter(order => order.status === 'delivered');

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Orders Management</h1>
        <Button variant="outline" onClick={fetchOrders}>
          Refresh
        </Button>
      </div>
      
      {selectedOrder ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Order #{selectedOrder.order_number}</CardTitle>
            <Button variant="outline" onClick={closeOrderDetails}>
              Back to List
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-medium mb-2">Order Information</h3>
                <p className="text-sm">Date: {new Date(selectedOrder.created_at).toLocaleString()}</p>
                <p className="text-sm">Status: <span className={`px-2 py-1 rounded-full text-xs ${
                  selectedOrder.status === 'delivered' ? 'bg-green-100 text-green-800' :
                  selectedOrder.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                  selectedOrder.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>{selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}</span></p>
                <p className="text-sm">Total: ₹{selectedOrder.total_amount}</p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Customer Information</h3>
                <p className="text-sm">Name: {selectedOrder.user_profiles?.name || 'N/A'}</p>
                <p className="text-sm">Email: {selectedOrder.user_profiles?.email || 'N/A'}</p>
                <p className="text-sm">Phone: {selectedOrder.user_profiles?.phone || 'N/A'}</p>
              </div>
            </div>
            
            <h3 className="font-medium mb-3">Order Items</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Color</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedOrder.order_items.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-gray-100 rounded overflow-hidden mr-2">
                          <img 
                            src={item.product_image || '/placeholder.svg'} 
                            alt={item.product_name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        {item.product_name}
                      </div>
                    </TableCell>
                    <TableCell>{item.product_code || 'N/A'}</TableCell>
                    <TableCell>{item.size || 'N/A'}</TableCell>
                    <TableCell>{item.color || 'N/A'}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">₹{item.price}</TableCell>
                    <TableCell className="text-right font-medium">₹{item.price * item.quantity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {selectedOrder.status === 'processing' && (
              <div className="mt-6 p-4 border rounded-md">
                <h3 className="font-medium mb-3">Ship this order</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-sm mb-1 block">Courier/Delivery Partner</label>
                    <Input 
                      value={shippingInfo.courier}
                      onChange={(e) => setShippingInfo({...shippingInfo, courier: e.target.value})}
                      placeholder="e.g., Delhivery, Blue Dart"
                    />
                  </div>
                  <div>
                    <label className="text-sm mb-1 block">Tracking ID</label>
                    <Input 
                      value={shippingInfo.trackingId}
                      onChange={(e) => setShippingInfo({...shippingInfo, trackingId: e.target.value})}
                      placeholder="e.g., ABCD1234567890"
                    />
                  </div>
                </div>
                <Button 
                  onClick={handleMarkAsShipped}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Truck size={16} className="mr-2" />
                  Mark as Shipped
                </Button>
              </div>
            )}
            
            {selectedOrder.status === 'shipped' && (
              <div className="mt-6">
                <div className="p-4 bg-blue-50 rounded-md mb-4">
                  <h3 className="font-medium mb-2">Shipping Information</h3>
                  <p className="text-sm">Courier: {selectedOrder.courier}</p>
                  <p className="text-sm">Tracking ID: {selectedOrder.tracking_id}</p>
                </div>
                <Button onClick={handleMarkAsDelivered} className="bg-green-600 hover:bg-green-700">
                  Mark as Delivered
                </Button>
              </div>
            )}
            
            {selectedOrder.status === 'delivered' && (
              <div className="mt-6 p-4 bg-green-50 rounded-md">
                <h3 className="font-medium mb-2">Delivery Information</h3>
                <p className="text-sm">Courier: {selectedOrder.courier}</p>
                <p className="text-sm">Tracking ID: {selectedOrder.tracking_id}</p>
                <p className="text-sm">Delivered on: {selectedOrder.delivered_at ? new Date(selectedOrder.delivered_at).toLocaleString() : 'N/A'}</p>
              </div>
            )}
            
            <div className="mt-6 flex justify-end">
              <Button variant="outline">
                <FileText size={16} className="mr-2" />
                Print Invoice
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="pending">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending">
              Pending Orders ({pendingOrders.length})
            </TabsTrigger>
            <TabsTrigger value="shipped">
              Shipped Orders ({shippedOrders.length})
            </TabsTrigger>
            <TabsTrigger value="delivered">
              Delivered Orders ({deliveredOrders.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending">
            <Card>
              <CardContent className="pt-6">
                {isLoading ? (
                  <div className="flex justify-center p-4">
                    <p>Loading orders...</p>
                  </div>
                ) : pendingOrders.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order #</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.order_number}</TableCell>
                          <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>{order.user_profiles?.name || 'Unknown'}</TableCell>
                          <TableCell className="text-right">₹{order.total_amount}</TableCell>
                          <TableCell className="text-right">
                            <span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 text-xs rounded-full">
                              Processing
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => handleViewOrder(order)}>
                              <Eye size={16} />
                              <span className="ml-1">View</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-500">No pending orders found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="shipped">
            <Card>
              <CardContent className="pt-6">
                {isLoading ? (
                  <div className="flex justify-center p-4">
                    <p>Loading orders...</p>
                  </div>
                ) : shippedOrders.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order #</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Courier</TableHead>
                        <TableHead>Tracking</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {shippedOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.order_number}</TableCell>
                          <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>{order.user_profiles?.name || 'Unknown'}</TableCell>
                          <TableCell>{order.courier || 'N/A'}</TableCell>
                          <TableCell>{order.tracking_id || 'N/A'}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => handleViewOrder(order)}>
                              <Eye size={16} />
                              <span className="ml-1">View</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-500">No shipped orders found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="delivered">
            <Card>
              <CardContent className="pt-6">
                {isLoading ? (
                  <div className="flex justify-center p-4">
                    <p>Loading orders...</p>
                  </div>
                ) : deliveredOrders.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order #</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {deliveredOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.order_number}</TableCell>
                          <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>{order.user_profiles?.name || 'Unknown'}</TableCell>
                          <TableCell className="text-right">₹{order.total_amount}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => handleViewOrder(order)}>
                              <Eye size={16} />
                              <span className="ml-1">View</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-500">No delivered orders found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </AdminLayout>
  );
}
