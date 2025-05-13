
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Promotion() {
  return (
    <section className="py-16 bg-gradient-to-r from-cutebae-pink to-cutebae-purple bg-opacity-30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <img 
              src="/placeholder.svg" 
              alt="Promotion" 
              className="w-full h-auto shadow-lg"
            />
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold mb-2">Special Collection</h2>
            <div className="h-1 w-16 bg-cutebae-coral mb-6 mx-auto md:mx-0"></div>
            <h3 className="text-xl text-cutebae-coral font-semibold mb-6">Get 20% Off on All Newborn Items</h3>
            <p className="text-gray-700 mb-8">
              Welcoming a new member to your family? Discover our premium newborn collection designed for comfort and cuteness. Use code <span className="font-bold">NEWBABY20</span> at checkout.
            </p>
            <Button asChild className="bg-cutebae-coral hover:bg-opacity-90 rounded-none px-8 py-5">
              <Link to="/category/newborn">Shop Now</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
