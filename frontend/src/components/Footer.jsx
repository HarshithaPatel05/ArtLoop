import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Globe, Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <>
      {/* VALUE PROPS - Global */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12 text-center">
           <div>
              <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                 <ShieldCheck className="w-8 h-8 text-orange-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">100% Authentic</h3>
              <p className="text-gray-400">Directly sourced from verified rural artisans.</p>
           </div>
           <div>
              <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                 <Globe className="w-8 h-8 text-orange-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Fair Trade</h3>
              <p className="text-gray-400">Artisans receive fair compensation for their invaluable craft.</p>
           </div>
           <div>
              <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                 <Sparkles className="w-8 h-8 text-orange-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Cultural Heritage</h3>
              <p className="text-gray-400">Every piece tells a story of Indian tradition.</p>
           </div>
        </div>
      </section>

      <footer className="bg-artloop-brown text-artloop-earth pt-16 pb-8">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-1">
          <h2 className="text-3xl font-serif font-bold text-artloop-saffron mb-6">Artloop</h2>
          <p className="text-sm opacity-80 leading-relaxed">
            Connecting Indian artisans directly with global homes. Discover the stories behind every stitch, stroke, and shape.
          </p>
        </div>
        
        <div>
          <h3 className="text-lg font-bold mb-6 text-white">Explore</h3>
          <ul className="space-y-4 text-sm opacity-80">
            <li><Link to="/shop" className="hover:text-artloop-saffron transition-colors">All Products</Link></li>
            <li><Link to="/categories/paintings" className="hover:text-artloop-saffron transition-colors">Paintings</Link></li>
            <li><Link to="/categories/jewelry" className="hover:text-artloop-saffron transition-colors">Jewelry</Link></li>
            <li><Link to="/categories/handloom" className="hover:text-artloop-saffron transition-colors">Handloom</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-6 text-white">Artisans</h3>
          <ul className="space-y-4 text-sm opacity-80">
            <li><Link to="/register-artisan" className="hover:text-artloop-saffron transition-colors">Join as Artisan</Link></li>
            <li><Link to="/artisan-stories" className="hover:text-artloop-saffron transition-colors">Artisan Stories</Link></li>
            <li><Link to="/support" className="hover:text-artloop-saffron transition-colors">Seller Handbook</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-6 text-white">Subscribe</h3>
          <p className="text-sm opacity-80 mb-4">Get updates on new collections and artisan stories.</p>
          <div className="flex">
            <input 
              type="email" 
              placeholder="Email address" 
              className="bg-white/10 border border-white/20 px-4 py-2 flex-grow focus:outline-none focus:border-artloop-saffron text-sm rounded-l" 
            />
            <button className="bg-artloop-saffron text-artloop-brown px-4 py-2 font-bold text-sm rounded-r hover:bg-opacity-90 transition-all">Join</button>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-6 mt-16 pt-8 border-t border-white/10 text-center text-xs opacity-50">
        <p>© 2026 Artloop. All rights reserved. Connecting Hands to Homes.</p>
      </div>
    </footer>
    </>
  );
};

export default Footer;
