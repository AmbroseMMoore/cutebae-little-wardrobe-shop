
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
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

  return (
    <Link 
      to={`/product/${product.id}`} 
      className="group block rounded-lg overflow-hidden card-hover"
    >
      <div className="aspect-square relative overflow-hidden bg-gray-100 rounded-t-lg">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
        <Button 
          onClick={handleAddToCart}
          className="absolute bottom-3 right-3 bg-white text-cutebae-coral hover:bg-cutebae-coral hover:text-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300"
          size="icon"
          variant="outline"
        >
          <ShoppingCart size={18} />
          <span className="sr-only">Add to cart</span>
        </Button>
      </div>
      <div className="p-4 bg-white">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-gray-900">{product.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{product.category} · {product.ageGroup}</p>
          </div>
          <p className="font-semibold text-cutebae-coral">${product.price.toFixed(2)}</p>
        </div>
      </div>
    </Link>
  );
}
