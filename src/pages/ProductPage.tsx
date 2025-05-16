
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import ProductGrid from '@/components/products/ProductGrid';
import { useStore } from '@/contexts/StoreContext';
import { getProductById, getProductsByCategory } from '@/data/products';

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quantity, setQuantity] = React.useState(1);
  const { addToCart } = useStore();
  
  const product = id ? getProductById(id) : undefined;
  
  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Product Not Found</h2>
          <p className="mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/')}>Return to Home</Button>
        </div>
      </Layout>
    );
  }
  
  const relatedProducts = getProductsByCategory(product.category)
    .filter(p => p.id !== product.id)
    .slice(0, 4);
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };
  
  const handleAddToCart = () => {
    addToCart(product, quantity); // Fixed to pass both product and quantity
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="bg-gray-100 rounded-lg overflow-hidden">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover object-center"
            />
          </div>
          
          {/* Product Details */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center mb-4">
              <span className="text-sm bg-cutebae-mint text-gray-800 px-3 py-1 rounded-full">{product.category}</span>
              <span className="mx-2 text-gray-400">•</span>
              <span className="text-sm bg-cutebae-purple bg-opacity-20 px-3 py-1 rounded-full">{product.ageGroup}</span>
            </div>
            
            <p className="text-2xl font-bold text-cutebae-coral mb-6">₹{Math.round(product.price * 83)}</p>
            
            <p className="text-gray-700 mb-8">{product.description}</p>
            
            {/* Quantity Selector */}
            <div className="mb-6">
              <p className="font-medium mb-2">Quantity</p>
              <div className="flex items-center">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={decreaseQuantity}
                  className="rounded-full"
                >
                  <Minus size={16} />
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={increaseQuantity}
                  className="rounded-full"
                >
                  <Plus size={16} />
                </Button>
              </div>
            </div>
            
            {/* Add to cart button */}
            <Button 
              onClick={handleAddToCart} 
              className="w-full bg-cutebae-coral hover:bg-opacity-90"
              size="lg"
            >
              <ShoppingCart size={18} className="mr-2" />
              Add to Cart
            </Button>
            
            {/* Free shipping notice */}
            <p className="text-center text-sm text-gray-600 mt-4">
              ✨ Free shipping on orders over ₹1000 ✨
            </p>
          </div>
        </div>
        
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <ProductGrid products={relatedProducts} title="You might also like" />
          </div>
        )}
      </div>
    </Layout>
  );
}
