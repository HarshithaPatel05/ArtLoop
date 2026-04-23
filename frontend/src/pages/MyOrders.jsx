import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Package } from 'lucide-react';
import { toast } from 'react-hot-toast';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/api/orders/myorders');
        setOrders(data);
      } catch (error) {
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div className="text-center py-20">Loading orders...</div>;

  return (
    <div className="min-h-screen bg-artloop-earth py-12">
      <div className="container mx-auto px-6 max-w-5xl">
        <h2 className="text-4xl font-serif font-bold text-artloop-brown mb-8 flex items-center">
          <Package className="mr-3" /> My Purchases
        </h2>
        
        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-artloop-clay/10">
            <p className="text-xl text-artloop-clay">You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order._id} className="bg-white rounded-2xl p-6 shadow-sm border border-artloop-clay/10">
                <div className="flex flex-col md:flex-row justify-between mb-4 border-b border-gray-100 pb-4">
                  <div>
                    <p className="text-sm text-gray-500">Order #{order._id}</p>
                    <p className="text-sm text-gray-500">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="mt-4 md:mt-0 text-right">
                    <p className="font-bold text-xl text-artloop-maroon">₹{order.totalAmount}</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mt-2 ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                      order.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.status || 'Pending'}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  {order.products.map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-4">
                      <div className="flex-1">
                        <p className="font-bold text-artloop-brown">Product ID: {item.product}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity} × ₹{item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
