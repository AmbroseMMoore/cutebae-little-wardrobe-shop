
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';
import ProductGrid from '@/components/products/ProductGrid';
import { categories, getProductsByCategory, ageGroups } from '@/data/products';

export default function CategoryPage() {
  const { id } = useParams<{ id: string }>();
  const [selectedAgeGroup, setSelectedAgeGroup] = React.useState<string | null>(null);
  
  const category = id 
    ? categories.find(c => c.id === id.toLowerCase()) 
    : undefined;
  
  const products = id 
    ? getProductsByCategory(id.charAt(0).toUpperCase() + id.slice(1)) 
    : [];
  
  const filteredProducts = selectedAgeGroup
    ? products.filter(product => product.ageGroup === selectedAgeGroup)
    : products;
  
  if (!category) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Category Not Found</h2>
          <p className="mb-6">The category you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/">Return to Home</Link>
          </Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">{category.name}</h1>
        
        {/* Age group filters */}
        <div className="mb-10">
          <h3 className="text-lg font-medium mb-3">Filter by Age</h3>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedAgeGroup === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedAgeGroup(null)}
              className={selectedAgeGroup === null ? "bg-cutebae-coral" : ""}
            >
              All Ages
            </Button>
            {ageGroups.map(ageGroup => (
              <Button
                key={ageGroup.id}
                variant={selectedAgeGroup === ageGroup.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedAgeGroup(ageGroup.id)}
                className={selectedAgeGroup === ageGroup.id ? "bg-cutebae-coral" : ""}
              >
                {ageGroup.name}
              </Button>
            ))}
          </div>
        </div>
        
        {filteredProducts.length > 0 ? (
          <ProductGrid products={filteredProducts} />
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-medium mb-2">No products found</h3>
            <p className="text-gray-600 mb-6">
              There are no products in this category with the selected filters.
            </p>
            {selectedAgeGroup && (
              <Button onClick={() => setSelectedAgeGroup(null)}>
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
