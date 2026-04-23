import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { AnimatePresence, motion } from 'framer-motion';

const Cart = () => {
  const navigate = useNavigate();

  const {
    cartItems,
    removeFromCart,
    updateQty,
    itemsPrice,
    loading
  } = useCart();

  // 🔐 Protect route
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    }
  }, [navigate]);

  // ⏳ Loading state
  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="text-lg text-gray-500">Loading your cart...</p>
      </div>
    );
  }

  // 🛒 Empty cart
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6">
        <ShoppingBag className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-3xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6 text-center">
          Looks like you haven’t added anything yet.
        </p>
        <Link
          to="/shop"
          className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-6xl mx-auto px-4 py-10">

        <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* 🛍 CART ITEMS */}
          <div className="lg:col-span-2 space-y-4">

            <AnimatePresence>
              {cartItems.map((item) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-white p-5 rounded-xl shadow flex gap-4"
                >
                  {/* IMAGE */}
                  <img
                    src={item.product?.images?.[0]}
                    alt={item.product?.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />

                  {/* DETAILS */}
                  <div className="flex-1 flex flex-col justify-between">

                    <div>
                      <h3 className="font-semibold text-lg">
                        {item.product?.name}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        ₹{item.product?.price} × {item.quantity}
                      </p>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex items-center justify-between mt-3">

                      {/* QTY CONTROL */}
                      <div className="flex items-center border rounded-lg overflow-hidden">

                        <button
                          onClick={() =>
                            updateQty && updateQty(item._id, Math.max(1, item.quantity - 1))
                          }
                          className="px-3 py-1 hover:bg-gray-100"
                        >
                          <Minus size={16} />
                        </button>

                        <span className="px-4">{item.quantity}</span>

                        <button
                          onClick={() =>
                            updateQty && updateQty(item._id, item.quantity + 1)
                          }
                          className="px-3 py-1 hover:bg-gray-100"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      {/* REMOVE */}
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* PRICE */}
                  <div className="font-bold text-lg">
                    ₹{item.product?.price * item.quantity}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <Link
              to="/shop"
              className="inline-flex items-center text-orange-500 font-semibold hover:underline mt-4"
            >
              <ArrowRight className="mr-2 rotate-180" />
              Continue Shopping
            </Link>
          </div>

          {/* 💳 SUMMARY */}
          <div>
            <div className="bg-white p-6 rounded-xl shadow sticky top-24">

              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{itemsPrice}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>

                <div className="flex justify-between font-bold border-t pt-3">
                  <span>Total</span>
                  <span>₹{itemsPrice}</span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="block text-center bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;