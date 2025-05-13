
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { ShoppingCart, Users, Package, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    totalRevenue: 0
  });
  
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch stats
        const { count: orderCount } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true });
          
        const { count: customerCount } = await supabase
          .from('user_profiles')
          .select('*', { count: 'exact', head: true });
          
        const { count: productCount } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true });
          
        // Calculate revenue (simplified version)
        const { data: orders } = await supabase
          .from('orders')
          .select('total_amount');
          
        const totalRevenue = orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;
        
        setStats({
          totalOrders: orderCount || 0,
          totalCustomers: customerCount || 0,
          totalProducts: productCount || 0,
          totalRevenue: totalRevenue
        });
        
        // Fetch recent orders
        const { data: recentOrdersData } = await supabase
          .from('orders')
          .select('*, user_profiles(name, email)')
          .order('created_at', { ascending: false })
          .limit(5);
          
        setRecentOrders(recentOrdersData || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '...' : stats.totalOrders}</div>
            <p className="text-xs text-gray-500">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '...' : stats.totalCustomers}</div>
            <p className="text-xs text-gray-500">+5% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '...' : stats.totalProducts}</div>
            <p className="text-xs text-gray-500">+3 new this week</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{isLoading ? '...' : stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-gray-500">+18% from last month</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest 5 orders placed on the store</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <div key={n} className="animate-pulse flex justify-between p-3 border-b">
                    <div className="w-1/3 h-5 bg-gray-200 rounded"></div>
                    <div className="w-1/4 h-5 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : recentOrders.length > 0 ? (
              <div className="space-y-2">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex justify-between items-center p-3 border-b">
                    <div>
                      <div className="font-medium">Order #{order.order_number}</div>
                      <div className="text-sm text-gray-500">
                        {order.user_profiles?.name || 'Customer'} • {new Date(order.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-right">₹{order.total_amount}</div>
                      <div className={`text-xs px-2 py-1 rounded-full text-center ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500">No orders found</p>
              </div>
            )}
            
            <div className="mt-4">
              <Button asChild variant="outline" size="sm">
                <a href="/admin/orders">View All Orders</a>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Button asChild className="bg-cutebae-coral">
                <a href="/admin/add-product">Add New Product</a>
              </Button>
              <Button asChild variant="outline">
                <a href="/admin/orders">Process Orders</a>
              </Button>
              <Button asChild variant="outline">
                <a href="/admin/shipments">Manage Shipments</a>
              </Button>
              <Button asChild variant="outline">
                <a href="/admin/returns">Handle Returns</a>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Database Connection</span>
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">Online</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Payment Processing</span>
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">Active</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Storage</span>
                  <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">80% Used</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
