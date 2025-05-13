
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { AlertCircle, Check, Loader2, Plus, X } from 'lucide-react';

export default function AddProductPage() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    ageGroup: '',
    inStock: true,
  });
  
  const [variants, setVariants] = useState([
    { size: '', color: '', quantity: '1' }
  ]);
  
  const [isUploading, setIsUploading] = useState(false);
  const [imageURL, setImageURL] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const categories = ['girls', 'boys', 'newborn', 'shoes', 'accessories', 'toys'];
  const ageGroups = ['0-3M', '3-6M', '6-12M', '1-2Y', '2-3Y', '3-4Y', '4-5Y', '5-6Y', '6-7Y', '7-8Y'];
  const sizes = ['0-3M', '3-6M', '6-12M', '1-2Y', '2-3Y', '3-4Y', '4-5Y', '5-6Y', '6-7Y', '7-8Y', 'S', 'M', 'L', 'XL'];
  const colors = ['Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Purple', 'Orange', 'Black', 'White', 'Grey', 'Brown'];
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };
  
  const handleVariantChange = (index: number, field: string, value: string) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
  };
  
  const addVariant = () => {
    setVariants([...variants, { size: '', color: '', quantity: '1' }]);
  };
  
  const removeVariant = (index: number) => {
    if (variants.length === 1) return; // Keep at least one variant
    const newVariants = variants.filter((_, i) => i !== index);
    setVariants(newVariants);
  };
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: 'Error',
        description: 'Image size should be less than 2MB',
        variant: 'destructive',
      });
      return;
    }
    
    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast({
        title: 'Error',
        description: 'Only JPEG, PNG and WebP images are allowed',
        variant: 'destructive',
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      const fileName = `${Date.now()}-${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);
        
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);
        
      setImageURL(data.publicUrl);
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Upload Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const generateProductCode = (name: string, size: string, color: string) => {
    // Convert product name to uppercase, take first 3 chars, replace spaces with nothing
    const nameCode = name.toUpperCase().replace(/\s+/g, '').substring(0, 3);
    
    // Use first char of size
    const sizeCode = size.replace(/\D/g, '').substring(0, 1) || 'X';
    
    // Use first 3 chars of color
    const colorCode = color.toUpperCase().substring(0, 3);
    
    // Add random 3-digit number
    const randomNum = Math.floor(Math.random() * 900) + 100;
    
    return `${nameCode}${sizeCode}${colorCode}${randomNum}`;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.price || !formData.category || !formData.ageGroup || !imageURL) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields and upload an image',
        variant: 'destructive',
      });
      return;
    }
    
    // Validate at least one complete variant
    const hasCompleteVariant = variants.some(v => v.size && v.color);
    if (!hasCompleteVariant) {
      toast({
        title: 'Error',
        description: 'Please add at least one complete variant with size and color',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Insert main product
      const { data: productData, error: productError } = await supabase
        .from('products')
        .insert({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          category: formData.category,
          age_group: formData.ageGroup,
          in_stock: formData.inStock,
          image: imageURL,
        })
        .select()
        .single();
        
      if (productError) throw productError;
      
      // Insert variants
      const variantsToInsert = variants
        .filter(v => v.size && v.color) // Only insert complete variants
        .map(v => ({
          product_id: productData.id,
          size: v.size,
          color: v.color,
          quantity: parseInt(v.quantity) || 1,
          product_code: generateProductCode(formData.name, v.size, v.color),
        }));
        
      if (variantsToInsert.length > 0) {
        const { error: variantError } = await supabase
          .from('product_variants')
          .insert(variantsToInsert);
          
        if (variantError) throw variantError;
      }
      
      toast({
        title: 'Success',
        description: 'Product added successfully',
      });
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        ageGroup: '',
        inStock: true,
      });
      setVariants([{ size: '', color: '', quantity: '1' }]);
      setImageURL('');
      
    } catch (error: any) {
      console.error('Error adding product:', error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Add New Product</h1>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter product name"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter product description"
                    rows={4}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleSelectChange('category', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="ageGroup">Age Group *</Label>
                    <Select
                      value={formData.ageGroup}
                      onValueChange={(value) => handleSelectChange('ageGroup', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select age group" />
                      </SelectTrigger>
                      <SelectContent>
                        {ageGroups.map((ageGroup) => (
                          <SelectItem key={ageGroup} value={ageGroup}>
                            {ageGroup}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="price">Price (₹) *</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="Enter price in rupees"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-8">
                    <input
                      type="checkbox"
                      id="inStock"
                      className="w-4 h-4"
                      checked={formData.inStock}
                      onChange={() => setFormData({...formData, inStock: !formData.inStock})}
                    />
                    <Label htmlFor="inStock">In Stock</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Product Variants</span>
                  <Button type="button" size="sm" onClick={addVariant}>
                    <Plus size={16} className="mr-1" /> Add Variant
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {variants.map((variant, index) => (
                  <div key={index} className="border p-4 rounded-md mb-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium">Variant {index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeVariant(index)}
                        disabled={variants.length <= 1}
                      >
                        <X size={16} className="text-gray-500" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label>Size *</Label>
                        <Select
                          value={variant.size}
                          onValueChange={(value) => handleVariantChange(index, 'size', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select size" />
                          </SelectTrigger>
                          <SelectContent>
                            {sizes.map((size) => (
                              <SelectItem key={size} value={size}>
                                {size}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label>Color *</Label>
                        <Select
                          value={variant.color}
                          onValueChange={(value) => handleVariantChange(index, 'color', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select color" />
                          </SelectTrigger>
                          <SelectContent>
                            {colors.map((color) => (
                              <SelectItem key={color} value={color}>
                                {color}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label>Quantity</Label>
                        <Input
                          type="number"
                          min="1"
                          value={variant.quantity}
                          onChange={(e) => handleVariantChange(index, 'quantity', e.target.value)}
                        />
                      </div>
                    </div>
                    
                    {variant.size && variant.color && (
                      <div className="mt-3 text-sm text-gray-600">
                        Product Code: <span className="font-medium">{generateProductCode(formData.name || 'PROD', variant.size, variant.color)}</span>
                      </div>
                    )}
                  </div>
                ))}
                
                {variants.length === 0 && (
                  <div className="text-center py-4">
                    <p className="text-gray-500">No variants added. Click "Add Variant" to add one.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Image</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Label htmlFor="image">Upload Image *</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">Max size: 2MB. Formats: JPEG, PNG, WebP</p>
                </div>
                
                {isUploading && (
                  <div className="text-center py-8 border rounded-md">
                    <Loader2 className="h-8 w-8 animate-spin text-cutebae-coral mx-auto" />
                    <p className="mt-2 text-sm">Uploading image...</p>
                  </div>
                )}
                
                {!isUploading && imageURL && (
                  <div className="border rounded-md overflow-hidden">
                    <img
                      src={imageURL}
                      alt="Product preview"
                      className="w-full h-64 object-contain object-center"
                    />
                    <div className="bg-green-50 p-2 text-center">
                      <p className="text-sm text-green-600 flex items-center justify-center">
                        <Check size={16} className="mr-1" /> Image uploaded successfully
                      </p>
                    </div>
                  </div>
                )}
                
                {!isUploading && !imageURL && (
                  <div className="border border-dashed rounded-md p-8 text-center">
                    <div className="text-gray-400 mb-2">No image uploaded</div>
                    <p className="text-xs text-gray-500">
                      Upload a product image for better visibility
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <Button
                  type="submit"
                  className="w-full bg-cutebae-coral"
                  disabled={isSubmitting || isUploading}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Product'
                  )}
                </Button>
                
                <div className="text-center mt-4 text-sm text-gray-500">
                  <span className="text-red-500">*</span> Required fields
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}
