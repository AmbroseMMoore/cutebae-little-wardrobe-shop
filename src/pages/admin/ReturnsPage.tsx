
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { Check, X, Package } from 'lucide-react';

export default function ReturnsPage() {
  const [returns, setReturns] = useState<any[]>([]);
  const [cancellations, setCancellations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    fetchReturnsAndCancellations();
  }, []);
  
  const fetchReturnsAndCancellations = async () => {
    setIsLoading(true);
    try {
      // Fetch returns
      const { data: returnsData, error: returnsError } = await supabase
        .from('returns')
        .select(`
          *,
          order:order_id (order_number),
          user:user_id (name, email, phone),
          product:product_id (name, image)
        `)
        .order('created_at', { ascending: false });
        
      if (returnsError) throw returnsError;
      
      // Fetch cancellations
      const { data: cancellationsData, error: cancellationsError } = await supabase
        .from('cancellations')
        .select(`
          *,
          order:order_id (order_number),
          user:user_id (name, email, phone)
        `)
        .order('created_at', { ascending: false });
        
      if (cancellationsError) throw cancellationsError;
      
      setReturns(returnsData || []);
      setCancellations(cancellationsData || []);
    } catch (error: any) {
      console.error('Error fetching returns and cancellations:', error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleApproveReturn = async (id: string) => {
    try {
      const { error } = await supabase
        .from('returns')
        .update({
          status: 'approved',
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state
      setReturns(returns.map(item => {
        if (item.id === id) {
          return { ...item, status: 'approved' };
        }
        return item;
      }));
      
      if (selectedItem?.id === id) {
        setSelectedItem({ ...selectedItem, status: 'approved' });
      }
      
      toast({
        title: 'Success',
        description: 'Return request approved',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };
  
  const handleRejectReturn = async (id: string) => {
    try {
      const { error } = await supabase
        .from('returns')
        .update({
          status: 'rejected',
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state
      setReturns(returns.map(item => {
        if (item.id === id) {
          return { ...item, status: 'rejected' };
        }
        return item;
      }));
      
      if (selectedItem?.id === id) {
        setSelectedItem({ ...selectedItem, status: 'rejected' });
      }
      
      toast({
        title: 'Success',
        description: 'Return request rejected',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };
  
  const handleApproveCancellation = async (id: string) => {
    try {
      const { error } = await supabase
        .from('cancellations')
        .update({
          status: 'approved',
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state
      setCancellations(cancellations.map(item => {
        if (item.id === id) {
          return { ...item, status: 'approved' };
        }
        return item;
      }));
      
      toast({
        title: 'Success',
        description: 'Cancellation request approved',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };
  
  const handleRejectCancellation = async (id: string) => {
    try {
      const { error } = await supabase
        .from('cancellations')
        .update({
          status: 'rejected',
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state
      setCancellations(cancellations.map(item => {
        if (item.id === id) {
          return { ...item, status: 'rejected' };
        }
        return item;
      }));
      
      toast({
        title: 'Success',
        description: 'Cancellation request rejected',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };
  
  const closeDetails = () => {
    setSelectedItem(null);
  };
  
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>;
      case 'processing':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Processing</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Returns & Cancellations</h1>
      </div>
      
      {selectedItem ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Return Request Details</CardTitle>
            <Button variant="outline" onClick={closeDetails}>
              Back to List
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Return Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Return ID:</span>
                    <span className="font-medium">{selectedItem.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Number:</span>
                    <span className="font-medium">#{selectedItem.order?.order_number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date Requested:</span>
                    <span>{new Date(selectedItem.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span>{renderStatusBadge(selectedItem.status)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reason:</span>
                    <span>{selectedItem.reason}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">Customer Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span>{selectedItem.user?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span>{selectedItem.user?.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span>{selectedItem.user?.phone || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3">Product Information</h3>
              <div className="flex items-center">
                <div className="h-16 w-16 bg-gray-100 rounded overflow-hidden mr-4">
                  <img 
                    src={selectedItem.product?.image || '/placeholder.svg'} 
                    alt={selectedItem.product?.name}
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <div>
                  <p className="font-medium">{selectedItem.product?.name}</p>
                  <p className="text-sm text-gray-600">
                    Size: {selectedItem.size}, Color: {selectedItem.color}
                  </p>
                  <p className="text-sm text-gray-600">
                    Quantity: {selectedItem.quantity}
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3">Additional Information</h3>
              <p className="text-gray-600 border rounded-md p-3 bg-gray-50">
                {selectedItem.description || 'No additional information provided.'}
              </p>
            </div>
            
            {selectedItem.status === 'pending' && (
              <div className="flex justify-end space-x-3">
                <Button 
                  variant="outline" 
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => handleRejectReturn(selectedItem.id)}
                >
                  <X size={16} className="mr-2" />
                  Reject Return
                </Button>
                <Button 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => handleApproveReturn(selectedItem.id)}
                >
                  <Check size={16} className="mr-2" />
                  Approve Return
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="returns" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="returns">Returns ({returns.length})</TabsTrigger>
            <TabsTrigger value="cancellations">Cancellations ({cancellations.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="returns">
            <Card>
              <CardHeader>
                <CardTitle>Return Requests</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center p-4">
                    <p>Loading returns...</p>
                  </div>
                ) : returns.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Return ID</TableHead>
                        <TableHead>Order</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {returns.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.id.substring(0, 8)}...</TableCell>
                          <TableCell>#{item.order?.order_number}</TableCell>
                          <TableCell>{item.user?.name}</TableCell>
                          <TableCell>{new Date(item.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>{renderStatusBadge(item.status)}</TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => setSelectedItem(item)}
                            >
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                    <h3 className="text-lg font-medium mb-1">No returns found</h3>
                    <p className="text-gray-500">
                      There are no return requests at this time.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="cancellations">
            <Card>
              <CardHeader>
                <CardTitle>Cancellation Requests</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center p-4">
                    <p>Loading cancellations...</p>
                  </div>
                ) : cancellations.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Order</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cancellations.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.id.substring(0, 8)}...</TableCell>
                          <TableCell>#{item.order?.order_number}</TableCell>
                          <TableCell>{item.user?.name}</TableCell>
                          <TableCell>{new Date(item.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>{item.reason}</TableCell>
                          <TableCell>{renderStatusBadge(item.status)}</TableCell>
                          <TableCell className="text-right">
                            {item.status === 'pending' ? (
                              <div className="flex justify-end space-x-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => handleRejectCancellation(item.id)}
                                >
                                  <X size={14} />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                  onClick={() => handleApproveCancellation(item.id)}
                                >
                                  <Check size={14} />
                                </Button>
                              </div>
                            ) : (
                              <span className="text-sm">
                                {item.status === 'approved' ? 'Approved' : 'Rejected'}
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <X className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                    <h3 className="text-lg font-medium mb-1">No cancellations found</h3>
                    <p className="text-gray-500">
                      There are no cancellation requests at this time.
                    </p>
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
