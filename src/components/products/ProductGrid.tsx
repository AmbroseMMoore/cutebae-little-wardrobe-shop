
import React from 'react';
import ProductCard from './ProductCard';
import { Product } from '@/contexts/StoreContext';

interface ProductGridProps {
  products: Product[];
  title?: string;
}

export default function ProductGrid({ products, title }: ProductGridProps) {
  return (
    <div>
      {title && (
        <>
          <h2 className="text-2xl font-bold mb-4 text-center">{title}</h2>
          <div className="h-1 w-24 bg-cutebae-coral mx-auto mb-8"></div>
        </>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
