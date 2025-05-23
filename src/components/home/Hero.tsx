
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative bg-gradient-to-r from-cutebae-pink to-cutebae-light-gray bg-opacity-20 overflow-hidden">
      <div className="container mx-auto px-4 py-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4">
              <span className="block">Adorable Fashion</span>
              <span className="block text-cutebae-coral">For Little Stars</span>
            </h1>
            <p className="text-base md:text-lg text-gray-700 mb-8">
              Discover cute and comfortable clothing, shoes, toys, and accessories for kids of all ages.
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Button asChild className="bg-cutebae-coral hover:bg-opacity-90 rounded-none px-6 py-5">
                <Link to="/category/girls">Shop Girls</Link>
              </Button>
              <Button asChild className="bg-cutebae-purple hover:bg-opacity-90 rounded-none px-6 py-5">
                <Link to="/category/boys">Shop Boys</Link>
              </Button>
              <Button asChild variant="outline" className="border-cutebae-coral text-cutebae-coral hover:bg-cutebae-coral hover:text-white rounded-none px-6 py-5">
                <Link to="/category/newborn" className="flex items-center">
                  New Arrivals <ArrowRight size={16} className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="hidden md:flex justify-end">
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-cutebae-yellow rounded-full opacity-20 animate-float" />
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-cutebae-coral rounded-full opacity-20 animate-float" style={{ animationDelay: '1s' }} />
              
              <div className="relative bg-white p-2 rounded-lg shadow-xl rotate-3 z-10">
                <img 
                  src="/placeholder.svg" 
                  alt="Cute kids fashion" 
                  className="w-full h-auto rounded-lg"
                />
              </div>
              <div className="absolute top-8 -left-4 bg-white p-2 rounded-lg shadow-lg -rotate-6 z-0">
                <img 
                  src="/placeholder.svg" 
                  alt="Cute kids fashion" 
                  className="w-32 h-32 object-cover rounded-lg"
                />
              </div>
              <div className="absolute bottom-4 -right-4 bg-white p-2 rounded-lg shadow-lg rotate-12 z-20">
                <img 
                  src="/placeholder.svg" 
                  alt="Cute kids fashion" 
                  className="w-28 h-28 object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
