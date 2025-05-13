
import React from 'react';
import ProductGrid from '../products/ProductGrid';
import { getFeaturedProducts } from '@/data/products';

export default function FeaturedProducts() {
  const featuredProducts = getFeaturedProducts(8);
  
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-2">Featured Products</h2>
        <p className="text-center text-gray-600 mb-10">Discover our most popular items for your little ones</p>
        <ProductGrid products={featuredProducts} />
      </div>
    </section>
  );
}
