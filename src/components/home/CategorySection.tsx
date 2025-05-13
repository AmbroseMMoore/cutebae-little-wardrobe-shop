
import React from 'react';
import { Link } from 'react-router-dom';
import { categories } from '@/data/products';

export default function CategorySection() {
  // Map category IDs to emoji icons
  const categoryIcons: Record<string, string> = {
    girls: '👧',
    boys: '👦',
    shoes: '👟',
    toys: '🧸',
    accessories: '🧢',
    newborn: '👶'
  };

  return (
    <section className="py-12 bg-cutebae-light-gray">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">Shop by Category</h2>
        <div className="h-1 w-24 bg-cutebae-coral mx-auto mb-8"></div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.id}`}
              className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all card-hover text-center"
            >
              <span className="text-4xl mb-3" role="img" aria-label={category.name}>
                {categoryIcons[category.id]}
              </span>
              <span className="font-medium">{category.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
