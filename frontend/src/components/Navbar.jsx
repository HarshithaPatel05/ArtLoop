import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Heart, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if(searchQuery.trim()) {
      navigate(`/shop?search=${searchQuery}`);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className="bg-white sticky top-0 z-50 border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4 lg:gap-8">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-3xl font-serif font-bold text-gray-900 tracking-tight hover:opacity-80 transition-opacity">
              Artloop
            </Link>
          </div>

          {/* Search Bar - Hidden on small screens */}
          <div className="hidden flex-1 md:flex justify-center max-w-2xl">
            <form onSubmit={handleSearch} className="w-full relative group">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for anything..." 
                className="w-full bg-gray-100 border-2 border-transparent hover:border-gray-200 hover:bg-white rounded-full py-2.5 pl-5 pr-12 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white transition-all duration-200 ease-in-out text-sm text-gray-900 placeholder-gray-500"
              />
              <button type="submit" className="absolute right-1 top-1 p-2 rounded-full bg-gray-900 text-white hover:bg-black transition-colors" aria-label="Search">
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-3 sm:space-x-6">
            {user?.role !== 'artisan' && (
              <Link to="/wishlist" className="hidden sm:flex flex-col items-center text-gray-600 hover:text-gray-900 transition-colors group relative">
                <div className="p-2 group-hover:bg-gray-100 rounded-full transition-colors">
                  <Heart className="w-5 h-5 group-hover:fill-red-50 group-hover:text-red-500 transition-colors" />
                </div>
                <span className="text-[10px] font-medium absolute -bottom-3 opacity-0 group-hover:opacity-100 transition-opacity">Wishlist</span>
              </Link>
            )}

            {user ? (
              <div className="relative group flex flex-col items-center">
                <Link to={user.role === 'artisan' ? '/artisan/dashboard' : user.role === 'admin' ? '/admin' : '/profile'} className="flex flex-col items-center text-gray-600 hover:text-gray-900 transition-colors relative">
                  <div className="p-2 group-hover:bg-gray-100 rounded-full transition-colors">
                    <User className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-medium absolute -bottom-3 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Profile</span>
                </Link>
                {/* Dropdown menu */}
                <div className="absolute top-12 right-0 w-48 bg-white border border-gray-100 shadow-xl rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 flex flex-col py-2 z-50">
                   <div className="px-4 py-2 border-b border-gray-100 mb-1">
                     <p className="text-sm font-bold text-gray-900 truncate">{user.name || user.email?.split('@')[0]}</p>
                     <p className="text-xs text-gray-500 capitalize">{user.role || 'Buyer'}</p>
                   </div>
                   <Link to={user.role === 'artisan' ? '/artisan/dashboard' : user.role === 'admin' ? '/admin' : '/profile'} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-medium">Dashboard</Link>
                   <Link to="/orders" className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-medium">Purchases</Link>
                   <button onClick={logout} className="px-4 py-2 mt-1 text-sm text-left text-red-600 hover:bg-red-50 font-medium border-t border-gray-100 w-full">Sign Out</button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="flex items-center text-sm font-bold text-gray-900 hover:bg-gray-100 rounded-full px-4 py-2 transition-colors">
                 Sign In
              </Link>
            )}

            {user?.role !== 'artisan' && (
              <Link to="/cart" className="flex flex-col items-center text-gray-600 hover:text-gray-900 transition-colors relative group">
                <div className="p-2 group-hover:bg-gray-100 rounded-full transition-colors relative">
                  <ShoppingCart className="w-5 h-5" />
                  {cartItems?.length > 0 && (
                    <span className="absolute top-0 right-0 bg-gray-900 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 ring-2 ring-white">
                      {cartItems.length}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-medium absolute -bottom-3 opacity-0 group-hover:opacity-100 transition-opacity">Cart</span>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle menu">
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Nav / Categories (Desktop) */}
      <div className="hidden md:flex border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
           <ul className="flex justify-center space-x-10 py-3">
              {['Paintings', 'Jewelry', 'Handloom', 'Home Decor', 'Tribal Crafts', 'Pottery'].map(cat => (
                 <li key={cat}>
                    <button onClick={() => navigate(`/shop?category=${cat}`)} className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors border-b-2 border-transparent hover:border-gray-900 pb-1">
                      {cat}
                    </button>
                 </li>
              ))}
           </ul>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 absolute w-full shadow-lg z-40">
           <div className="px-4 py-4 space-y-4">
             <form onSubmit={handleSearch} className="w-full relative">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..." 
                  className="w-full bg-gray-100 border border-transparent rounded-full py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
                />
                <button type="submit" className="absolute right-2 top-2 p-1.5 rounded-full text-gray-500 bg-gray-200">
                  <Search className="w-4 h-4" />
                </button>
              </form>
              <div className="flex flex-col space-y-1">
                 <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 mt-2 pl-2">Categories</p>
                 {['Paintings', 'Jewelry', 'Handloom', 'Home Decor', 'Tribal Crafts', 'Pottery'].map(cat => (
                   <button key={cat} onClick={() => { navigate(`/shop?category=${cat}`); setIsMobileMenuOpen(false); }} className="text-sm text-left font-medium text-gray-700 py-3 px-2 rounded-lg hover:bg-gray-50">{cat}</button>
                 ))}
              </div>
           </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
