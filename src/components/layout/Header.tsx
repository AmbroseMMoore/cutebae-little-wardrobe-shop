
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, X, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/contexts/StoreContext';
import { categories } from '@/data/products';

export default function Header() {
  const { cartCount } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top header with promotions */}
        <div className="bg-cutebae-coral text-white text-center py-1 text-sm font-medium -mx-4">
          Free Shipping on Orders Above ₹599 | Shop Now
        </div>
        
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="text-2xl font-bold text-cutebae-coral flex items-center">
              <img src="/placeholder.svg" alt="Cutebae" className="h-10 mr-2" />
              <span>Cutebae</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {categories.map(category => (
              <Link
                key={category.id}
                to={`/category/${category.id}`}
                className="text-gray-700 hover:text-cutebae-coral font-medium text-sm uppercase tracking-wider"
              >
                {category.name}
              </Link>
            ))}
          </nav>

          {/* Search and Cart */}
          <div className="flex items-center space-x-5">
            <Link to="/search" className="text-gray-700 hover:text-cutebae-coral">
              <Search size={22} />
            </Link>
            
            <Link to="/account" className="text-gray-700 hover:text-cutebae-coral">
              <User size={22} />
            </Link>
            
            <Link to="/cart" className="relative">
              <ShoppingCart size={22} className="text-gray-700 hover:text-cutebae-coral" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-cutebae-coral text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 pb-6 border-t">
            <nav className="flex flex-col space-y-4">
              {categories.map(category => (
                <Link
                  key={category.id}
                  to={`/category/${category.id}`}
                  className="text-gray-700 hover:text-cutebae-coral font-medium uppercase text-sm px-2 py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
