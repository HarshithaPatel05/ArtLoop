import { createContext, useContext, useEffect, useState } from 'react';
import API from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

// Create Wishlist context
export const WishlistContext = createContext();

// Custom hook for consuming the context
export const useWishlist = () => useContext(WishlistContext);

// Provider component
export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const { user } = useAuth();

  // Fetch wishlist items
  const fetchWishlist = async () => {
    try {
      const res = await API.get('/api/wishlist'); // token added via interceptor
      setWishlist(res.data);
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    }
  };

  // Add product to wishlist
  const addToWishlist = async (productId) => {
    try {
      const res = await API.post(`/api/wishlist/add/${productId}`);
      setWishlist(res.data);
      toast.success('Added to Wishlist!');
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
      toast.error('Failed or already in wishlist');
    }
  };

  // Remove product from wishlist
  const removeFromWishlist = async (productId) => {
    try {
      const res = await API.delete(`/api/wishlist/remove/${productId}`);
      setWishlist(res.data);
      toast.success('Removed from Wishlist!');
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
      toast.error('Failed to remove');
    }
  };

  // Load wishlist on mount
  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setWishlist([]);
    }
  }, [user]);

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};