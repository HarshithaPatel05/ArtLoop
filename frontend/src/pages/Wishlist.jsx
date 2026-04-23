import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { Heart, Trash2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Wishlist = () => {
  const navigate = useNavigate();
  const { wishlist, removeFromWishlist } = useWishlist();

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    }
  }, [navigate]);

  if (wishlist.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6">
        <Heart className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-3xl font-bold mb-2 text-artloop-brown">Your wishlist is empty</h2>
        <p className="text-gray-500 mb-6 text-center">
          Save items you love and buy them later.
        </p>
        <Link
          to="/shop"
          className="btn-primary px-6 py-3 rounded-lg shadow-lg"
        >
          Discover Art
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-serif font-bold text-artloop-brown mb-8">My Wishlist</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence>
            {wishlist.map((item) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group relative"
              >
                <Link to={`/products/${item._id}`}>
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <img
                      src={item.images?.[0] || item.image || 'https://via.placeholder.com/300'}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </Link>
                
                <div className="p-5">
                  <h3 className="font-bold text-lg text-artloop-brown truncate">{item.name}</h3>
                  <p className="text-sm text-gray-500 mb-4">{item.category}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xl text-artloop-maroon">₹{item.price}</span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        removeFromWishlist(item._id);
                      }}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;