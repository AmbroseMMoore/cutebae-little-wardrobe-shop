
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import ProductGrid from '@/components/products/ProductGrid';
import { products, Product } from '@/data/products';

export default function SearchPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  
  React.useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);
  
  const performSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }
    
    const lowercaseQuery = query.toLowerCase().trim();
    const results = products.filter(product => 
      product.name.toLowerCase().includes(lowercaseQuery) || 
      product.description.toLowerCase().includes(lowercaseQuery) || 
      product.category.toLowerCase().includes(lowercaseQuery)
    );
    
    setSearchResults(results);
    setHasSearched(true);
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchQuery);
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Search Products</h1>
        
        <form onSubmit={handleSearch} className="max-w-lg mx-auto mb-12">
          <div className="flex gap-2">
            <Input 
              type="text" 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products..." 
              className="w-full"
            />
            <Button type="submit">
              <Search size={20} />
              <span className="ml-2">Search</span>
            </Button>
          </div>
        </form>
        
        {hasSearched && (
          searchResults.length > 0 ? (
            <div>
              <h2 className="text-xl font-medium mb-6">
                Search results for "{searchQuery}" ({searchResults.length} items)
              </h2>
              <ProductGrid products={searchResults} />
            </div>
          ) : (
            <div className="text-center py-10">
              <h2 className="text-xl font-medium mb-2">No results found</h2>
              <p className="text-gray-600">
                We couldn't find any products matching "{searchQuery}".
              </p>
              <p className="mt-2 text-gray-600">
                Try using different keywords or check for spelling mistakes.
              </p>
            </div>
          )
        )}
        
        {!hasSearched && (
          <div className="text-center py-8">
            <p className="text-gray-600">
              Enter a search term to find products.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
