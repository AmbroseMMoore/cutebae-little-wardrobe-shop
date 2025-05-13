
import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function Footer() {
  const { user } = useAuth();
  
  return (
    <footer className="bg-cutebae-light-gray pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-4">About Cutebae</h3>
            <p className="text-gray-600">
              Cutebae offers adorable and comfortable clothing, shoes, toys, and accessories for kids of all ages.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-lg font-bold mb-4">Shop</h3>
            <ul className="space-y-2">
              <li><Link to="/category/girls" className="text-gray-600 hover:text-cutebae-coral">Girls</Link></li>
              <li><Link to="/category/boys" className="text-gray-600 hover:text-cutebae-coral">Boys</Link></li>
              <li><Link to="/category/shoes" className="text-gray-600 hover:text-cutebae-coral">Shoes</Link></li>
              <li><Link to="/category/toys" className="text-gray-600 hover:text-cutebae-coral">Toys</Link></li>
              <li><Link to="/category/accessories" className="text-gray-600 hover:text-cutebae-coral">Accessories</Link></li>
              <li><Link to="/category/newborn" className="text-gray-600 hover:text-cutebae-coral">Newborn</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-bold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li><Link to="/contact" className="text-gray-600 hover:text-cutebae-coral">Contact Us</Link></li>
              <li><Link to="/shipping" className="text-gray-600 hover:text-cutebae-coral">Shipping & Returns</Link></li>
              <li><Link to="/faq" className="text-gray-600 hover:text-cutebae-coral">FAQ</Link></li>
              <li><Link to="/size-guide" className="text-gray-600 hover:text-cutebae-coral">Size Guide</Link></li>
              {user && (
                <li><Link to="/admin" className="text-cutebae-coral font-medium hover:underline">Admin CMS</Link></li>
              )}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-lg font-bold mb-4">Connect With Us</h3>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="text-gray-600 hover:text-cutebae-coral">
                <Instagram size={22} />
              </a>
              <a href="#" className="text-gray-600 hover:text-cutebae-coral">
                <Facebook size={22} />
              </a>
              <a href="#" className="text-gray-600 hover:text-cutebae-coral">
                <Twitter size={22} />
              </a>
            </div>
            <p className="text-gray-600">Sign up for our newsletter</p>
            <div className="mt-2 flex">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 border rounded-l-md focus:outline-none focus:ring-1 focus:ring-cutebae-coral"
              />
              <button className="bg-cutebae-coral text-white px-4 py-2 rounded-r-md hover:bg-opacity-90">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Cutebae. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-4 text-sm text-gray-500">
            <Link to="/privacy" className="hover:text-cutebae-coral">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-cutebae-coral">Terms of Service</Link>
            {!user && (
              <Link to="/admin" className="hover:text-cutebae-coral">Admin</Link>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
