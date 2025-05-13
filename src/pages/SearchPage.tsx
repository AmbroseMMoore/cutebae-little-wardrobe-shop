
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ProductGrid from '@/components/products/ProductGrid';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { products } from '@/data/products';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [searchResults, setSearchResults] = useState([]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: searchTerm });
  };
  
  useEffect(() => {
    const query = searchParams.get('q')?.toLowerCase() || '';
    setSearchTerm(query);
    
    if (!query) {
      setSearchResults([]);
      return;
    }
    
    const filteredProducts = products.filter((product) => {
      return (
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
    });
    
    setSearchResults(filteredProducts);
  }, [searchParams]);
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">Search Products</h1>
        
        <form onSubmit={handleSearch} className="mb-8 flex gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="search"
              placeholder="Search for products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </form>
        
        {searchParams.has('q') && (
          <>
            {searchResults.length > 0 ? (
              <>
                <p className="mb-6">
                  {searchResults.length} result{searchResults.length !== 1 && 's'} found for "{searchParams.get('q')}"
                </p>
                <ProductGrid products={searchResults} />
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-gray-600">
                  No results found for "{searchParams.get('q')}". Try a different search term.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
