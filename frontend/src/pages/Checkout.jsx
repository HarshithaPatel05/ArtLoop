import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import { CheckCircle, MapPin, Phone, ChevronRight, CreditCard, Package } from 'lucide-react';

const Checkout = () => {
  const { cartItems, itemsPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [address, setAddress] = useState({
    street: '',
    city: '',
    zipCode: '',
    phone: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step < 2) {
      setStep(step + 1);
      return;
    }

    if (!cartItems.length) {
      toast.error('Your cart is empty');
      return;
    }

    try {
      const orderData = {
        products: cartItems.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.price
        })),
        shippingAddress: address,
        totalAmount: itemsPrice,
        paymentMethod: 'COD'
      };

      await api.post('/api/orders', orderData);

      toast.success('Order placed successfully!');
      clearCart();
      setStep(3);
    } catch {
      toast.error('Failed to place order');
    }
  };

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    }
  }, [navigate]);

  if (step === 3) {
    return (
      <div className="min-h-screen bg-artloop-earth flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-[3rem] p-12 text-center shadow-2xl border border-artloop-clay/10">
          <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-4xl font-serif font-bold text-artloop-brown mb-4">Shubharambh!</h2>
          <p className="text-xl text-artloop-clay mb-4">Your order has been placed.</p>
          <p className="text-artloop-brown/60 mb-10 leading-relaxed">Thank you for supporting traditional Indian craftsmanship. You will receive a confirmation call shortly.</p>
          <div className="space-y-4">
            <Link to="/orders" className="block w-full btn-primary py-4">View Orders</Link>
            <Link to="/" className="block w-full text-artloop-maroon font-bold hover:underline">Return to Home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-artloop-earth py-12">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="flex items-center justify-center mb-12 space-x-4">
          <div className={`flex items-center space-x-2 ${step >= 1 ? 'text-artloop-maroon' : 'text-artloop-clay'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-artloop-maroon text-white shadow-lg' : 'bg-white border-2 border-artloop-clay'}`}>1</div>
            <span className="font-bold">Shipping</span>
          </div>
          <div className={`w-12 h-0.5 ${step >= 2 ? 'bg-artloop-maroon' : 'bg-artloop-clay/30'}`}></div>
          <div className={`flex items-center space-x-2 ${step >= 2 ? 'text-artloop-maroon' : 'text-artloop-clay'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-artloop-maroon text-white shadow-lg' : 'bg-white border-2 border-artloop-clay'}`}>2</div>
            <span className="font-bold">Payment</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Checkout Form */}
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-artloop-clay/10">
            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <div
                    key="step1"
                    className="space-y-6"
                  >
                    <h2 className="text-3xl font-serif font-bold text-artloop-brown mb-8 flex items-center">
                      <MapPin className="mr-3 text-artloop-maroon" /> Shipping Details
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-artloop-brown mb-2">Street Address</label>
                        <input 
                          required
                          className="w-full p-4 bg-artloop-earth/30 border border-artloop-clay/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-artloop-maroon/20"
                          value={address.street}
                          onChange={(e) => setAddress({...address, street: e.target.value})}
                          placeholder="House No, Street, Area"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-artloop-brown mb-2">City</label>
                          <input 
                            required
                            className="w-full p-4 bg-artloop-earth/30 border border-artloop-clay/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-artloop-maroon/20"
                            value={address.city}
                            onChange={(e) => setAddress({...address, city: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-artloop-brown mb-2">Zip Code</label>
                          <input 
                            required
                            className="w-full p-4 bg-artloop-earth/30 border border-artloop-clay/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-artloop-maroon/20"
                            value={address.zipCode}
                            onChange={(e) => setAddress({...address, zipCode: e.target.value})}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-artloop-brown mb-2">Phone Number</label>
                        <div className="relative">
                           <Phone className="absolute left-4 top-4 w-5 h-5 text-artloop-clay" />
                           <input 
                            required
                            className="w-full pl-12 pr-4 py-4 bg-artloop-earth/30 border border-artloop-clay/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-artloop-maroon/20"
                            value={address.phone}
                            onChange={(e) => setAddress({...address, phone: e.target.value})}
                            placeholder="+91 00000 00000"
                           />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 1 && (
                   <button 
                    type="submit"
                    className="w-full mt-10 btn-primary py-4 text-xl flex items-center justify-center shadow-lg"
                  >
                    Continue to Payment <ChevronRight className="ml-2 w-6 h-6" />
                  </button>
                )}

                {step === 2 && (
                  <div
                    key="step2"
                    className="space-y-8"
                  >
                    <h2 className="text-3xl font-serif font-bold text-artloop-brown mb-8 flex items-center">
                      <CreditCard className="mr-3 text-artloop-maroon" /> Payment Method
                    </h2>
                    
                    <div className="space-y-4">
                       <label className="flex items-center p-6 border-2 border-artloop-maroon bg-artloop-maroon/5 rounded-2xl cursor-pointer">
                          <input type="radio" checked readOnly className="form-radio text-artloop-maroon" />
                          <div className="ml-4 flex-grow">
                             <p className="font-bold text-artloop-brown">Cash on Delivery (COD)</p>
                             <p className="text-sm text-artloop-brown/60">Pay when your craft arrives at your door.</p>
                          </div>
                       </label>

                       <div className="p-6 border-2 border-artloop-clay/10 rounded-2xl opacity-50 bg-gray-50 cursor-not-allowed grayscale">
                          <div className="flex items-center">
                            <input type="radio" disabled className="form-radio" />
                            <div className="ml-4">
                               <p className="font-bold">UPI / Credit Card / Debit Card</p>
                               <p className="text-xs text-red-500 font-bold uppercase mt-1">Coming Soon</p>
                            </div>
                          </div>
                       </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-2xl">
                       <p className="text-sm text-yellow-800 leading-relaxed font-medium">
                          <strong>Note:</strong> Since our artisans often create these on order, please ensure someone is available to receive the package to support their livelihood.
                       </p>
                    </div>

                    <div className="flex space-x-4">
                      <button 
                        type="button"
                        onClick={() => setStep(1)}
                        className="w-1/3 py-4 border-2 border-artloop-clay/20 rounded-xl font-bold text-artloop-brown hover:bg-gray-100 transition-all"
                      >
                        Back
                      </button>
                      <button 
                        type="submit"
                        className="flex-grow btn-primary py-4 text-xl flex items-center justify-center shadow-lg"
                      >
                        Place Order <CheckCircle className="ml-2 w-6 h-6" />
                      </button>
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </form>
          </div>

          {/* Cart Summary Card */}
          <div className="lg:col-span-1">
             <div className="bg-artloop-brown text-artloop-earth p-8 rounded-3xl shadow-2xl sticky top-28">
                <h3 className="text-2xl font-serif font-bold border-b border-white/10 pb-6 mb-8 flex items-center">
                  <Package className="mr-2" /> Your Selection
                </h3>
                
                <div className="max-h-[40vh] overflow-y-auto space-y-6 pr-2 mb-8 custom-scrollbar">
                  {cartItems.map(item => (
                    <div key={item._id} className="flex space-x-4 items-center">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-white/10 flex-shrink-0">
                        <img src={item.product?.images?.[0]} alt={item.product?.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow">
                        <p className="font-bold text-sm line-clamp-1">{item.product?.name}</p>
                        <p className="text-xs opacity-60">QTY: {item.quantity} × ₹{item.product?.price}</p>
                      </div>
                      <p className="font-bold text-artloop-saffron">₹{item.product?.price * item.quantity}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 pt-6 border-t border-white/10">
                   <div className="flex justify-between text-sm opacity-60">
                      <span>Subtotal</span>
                      <span>₹{itemsPrice}</span>
                   </div>
                   <div className="flex justify-between text-sm opacity-60">
                      <span>Shipping Fee</span>
                      <span className="text-artloop-saffron">FREE</span>
                   </div>
                   <div className="flex justify-between text-xl font-serif font-bold pt-4 text-white">
                      <span>Total</span>
                      <span className="text-artloop-saffron">₹{itemsPrice}</span>
                   </div>
                </div>
                
                <div className="mt-12 text-center text-xs opacity-40">
                   🔒 SSL Secured & Encrypted Transaction
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
