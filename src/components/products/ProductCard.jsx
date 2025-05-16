
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/contexts/StoreContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useStore();
  
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };
  
  return (
    <Link to={`/product/${product.id}`} className="group">
      <div className="relative overflow-hidden rounded-md bg-gray-100 aspect-[3/4]">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full bg-white hover:bg-gray-100"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="sr-only">Add to cart</span>
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full bg-white hover:bg-gray-100"
          >
            <Heart className="h-4 w-4" />
            <span className="sr-only">Add to wishlist</span>
          </Button>
        </div>
      </div>
      <div className="mt-3">
        <h3 className="text-sm font-medium">{product.name}</h3>
        <p className="text-sm font-bold text-cutebae-coral mt-1">₹{Math.round(product.price * 83)}</p>
      </div>
    </Link>
  );
};

export default ProductCard;
