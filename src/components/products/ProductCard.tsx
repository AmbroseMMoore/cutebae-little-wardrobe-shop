
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart } from 'lucide-react';
import { useStore, Product } from '@/contexts/StoreContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  // Convert USD price to INR (approximate rate: 1 USD = 83 INR)
  const priceInRupees = Math.round(product.price * 83);

  return (
    <Link 
      to={`/product/${product.id}`} 
      className="group block rounded-none overflow-hidden card-hover bg-white"
    >
      <div className="aspect-square relative overflow-hidden bg-gray-100">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
        <div className="absolute top-0 left-0 w-full p-3 flex justify-between opacity-0 group-hover:opacity-100 transition-all duration-300">
          <Button 
            className="bg-white text-cutebae-coral hover:bg-cutebae-coral hover:text-white rounded-full p-2 shadow-md"
            size="icon"
            variant="outline"
          >
            <Heart size={18} />
            <span className="sr-only">Add to wishlist</span>
          </Button>
          <Button 
            onClick={handleAddToCart}
            className="bg-white text-cutebae-coral hover:bg-cutebae-coral hover:text-white rounded-full p-2 shadow-md"
            size="icon"
            variant="outline"
          >
            <ShoppingCart size={18} />
            <span className="sr-only">Add to cart</span>
          </Button>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-gray-900 text-sm">{product.name}</h3>
            <p className="text-xs text-gray-600 mt-1">{product.category} · {product.ageGroup}</p>
          </div>
          <p className="font-semibold text-cutebae-coral">₹{priceInRupees}</p>
        </div>
      </div>
    </Link>
  );
}
