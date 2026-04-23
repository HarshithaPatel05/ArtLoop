import { createContext, useContext, useEffect, useState } from 'react';
import API from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { user } = useAuth();

  // ✅ FETCH CART
  const fetchCart = async () => {
    try {
      const res = await API.get('/api/cart'); // API already has token

      // backend returns: { userId, items: [...] }
      setCartItems(res.data.items || []);
    } catch (err) {
      console.error("Fetch cart error:", err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [user]);

  // ✅ ADD TO CART
  const addToCart = async (product) => {
    try {
      await API.post('/api/cart/add', {
        productId: product._id,
        quantity: 1, // ⚠️ must match backend
      });

      await fetchCart();
      toast.success('Added to cart');
    } catch (err) {
      console.error(err);
      toast.error('Error adding to cart');
    }
  };

  // ✅ REMOVE FROM CART (uses item._id, NOT productId)
  const removeFromCart = async (itemId) => {
    try {
      await API.delete(`/api/cart/${itemId}`);

      await fetchCart();
      toast.success('Removed from cart');
    } catch (err) {
      console.error(err);
    }
  };

  const updateQty = async (itemId, quantity) => {
    try {
      await API.put(`/api/cart/${itemId}`, { quantity });
      await fetchCart();
    } catch (err) {
      console.error(err);
      toast.error('Error updating quantity');
    }
  };

  const clearCart = async () => {
    try {
      await API.delete(`/api/cart/clear`);
      setCartItems([]);
    } catch (err) {
      console.error(err);
      toast.error('Error clearing cart');
    }
  };

  // ✅ TOTAL PRICE (matches schema)
  const itemsPrice = cartItems.reduce(
    (acc, item) =>
      acc + (item.product?.price || 0) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        itemsPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);