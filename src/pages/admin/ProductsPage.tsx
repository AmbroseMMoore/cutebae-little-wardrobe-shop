
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuLabel, DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { 
  PlusCircle, MoreVertical, Edit, Trash, 
  Search, FilterX, ArrowUpDown
} from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortColumn, setSortColumn] = useState('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const { toast } = useToast();
  
  const categories = ['all', 'boys', 'girls', 'newborn', 'shoes', 'accessories', 'toys'];
  
  useEffect(() => {
    fetchProducts();
  }, [sortColumn, sortDirection]);
  
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('products')
        .select('*')
        .order(sortColumn, { ascending: sortDirection === 'asc' });
        
      const { data, error } = await query;
        
      if (error) throw error;
      
      setProducts(data || []);
    } catch (error: any) {
      console.error('Error fetching products:', error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setProducts(products.filter(product => product.id !== id));
      
      toast({
        title: 'Success',
        description: 'Product deleted successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    filterProducts();
  };
  
  const filterProducts = () => {
    fetchProducts().then(() => {
      let filtered = [...products];
      
      // Apply search term
      if (searchTerm) {
        filtered = filtered.filter(product => 
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.product_code?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // Apply category filter
      if (categoryFilter !== 'all') {
        filtered = filtered.filter(product => 
          product.category.toLowerCase() === categoryFilter.toLowerCase()
        );
      }
      
      setProducts(filtered);
    });
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('all');
    fetchProducts();
  };
  
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };
  
  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString()}`;
  };
  
  const filteredProducts = products.filter(product => {
    // Apply search term
    const matchesSearch = !searchTerm || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.product_code?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply category filter
    const matchesCategory = categoryFilter === 'all' || 
      product.category.toLowerCase() === categoryFilter.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products Management</h1>
        <Button asChild className="bg-cutebae-coral">
          <Link to="/admin/add-product">
            <PlusCircle size={16} className="mr-2" />
            Add New Product
          </Link>
        </Button>
      </div>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <form onSubmit={handleSearch} className="flex gap-2">
                <Input
                  placeholder="Search by name or code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" variant="secondary">
                  <Search size={16} />
                </Button>
              </form>
            </div>
            
            <div className="flex gap-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 rounded-md border border-gray-300 text-sm"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
              
              <Button variant="outline" onClick={clearFilters} className="whitespace-nowrap">
                <FilterX size={16} className="mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Product List ({filteredProducts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-4">
              <p>Loading products...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
                      <div className="flex items-center">
                        Name
                        {sortColumn === 'name' && (
                          <ArrowUpDown size={14} className="ml-1" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Age Group</TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('price')}>
                      <div className="flex items-center">
                        Price
                        {sortColumn === 'price' && (
                          <ArrowUpDown size={14} className="ml-1" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>In Stock</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="h-12 w-12 bg-gray-100 rounded overflow-hidden">
                          <img 
                            src={product.image || '/placeholder.svg'} 
                            alt={product.name}
                            className="h-full w-full object-cover object-center"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.product_code || 'N/A'}</TableCell>
                      <TableCell>
                        <span className="capitalize">{product.category}</span>
                      </TableCell>
                      <TableCell>{product.age_group}</TableCell>
                      <TableCell>{formatPrice(product.price)}</TableCell>
                      <TableCell>{product.in_stock ? 'Yes' : 'No'}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical size={16} />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                              <Link to={`/admin/edit-product/${product.id}`}>
                                <Edit size={16} className="mr-2" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <Trash size={16} className="mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500">No products found</p>
              <Button asChild className="mt-4">
                <Link to="/admin/add-product">Add New Product</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
