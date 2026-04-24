import React, { useState, useEffect } from 'react';
import { Users, ShoppingBag, CheckCircle, XCircle, TrendingUp, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }
    const userInfo = localStorage.getItem('userInfo');
    const parsedUser = userInfo ? JSON.parse(userInfo) : null;
    if (parsedUser?.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchUsers();
    fetchProducts();
    fetchOrders();
    fetchReviews();
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/api/auth/users');
      setUsers(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch users');
    }
  };

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/api/products');
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/api/orders');
      setOrders(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchReviews = async () => {
    try {
      const { data } = await api.get('/api/reviews');
      setReviews(data);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteUser = async (id) => {
    try {
      await api.delete(`/api/auth/users/${id}`);
      setUsers(users.filter(u => u._id !== id));
      toast.success('User deleted!');
    } catch (err) {
      toast.error('Failed to delete user');
    }
  };

  const approveArtisan = async (id) => {
    try {
      await api.put(`/api/auth/users/${id}/approve`, {});
      setUsers(users.map(u => u._id === id ? { ...u, artisanDetails: { ...u.artisanDetails, isApproved: true } } : u));
      toast.success('Artisan approved!');
    } catch (err) {
      toast.error('Failed to approve artisan');
    }
  };

  const deleteProduct = async (id) => {
    try {
      await api.delete(`/api/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success('Product deleted');
    } catch {
      toast.error('Failed to delete product');
    }
  };

  const deleteReview = async (id) => {
    try {
      await api.delete(`/api/reviews/${id}`);
      setReviews((prev) => prev.filter((r) => r._id !== id));
      toast.success('Review deleted');
    } catch {
      toast.error('Failed to delete review');
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      const { data } = await api.put(`/api/orders/${id}/status`, { status });
      setOrders((prev) => prev.map((o) => (o._id === id ? data : o)));
      toast.success('Order status updated');
    } catch {
      toast.error('Failed to update order');
    }
  };

  const filteredUsers = users.filter((u) =>
    `${u.name} ${u.email} ${u.role}`.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredProducts = products.filter((p) =>
    `${p.name} ${p.category}`.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredOrders = orders.filter((o) =>
    `${o._id} ${o.paymentMethod || ''} ${o.status || ''}`.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredReviews = reviews.filter((r) =>
    `${r.comment} ${r.user?.name || ''} ${r.product?.name || ''}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-artloop-earth py-12">
      <div className="container mx-auto px-6">
        <h1 className="text-5xl font-serif font-bold text-artloop-brown mb-12">Admin Command Center</h1>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
           {[
             { label: 'Total Users', val: users.length, icon: <Users />, color: 'bg-blue-500' },
             { label: 'Total Orders', val: orders.length, icon: <ShoppingBag />, color: 'bg-orange-500' },
             { label: 'Pending Approvals', val: users.filter((u) => u.role === 'artisan' && !u.artisanDetails?.isApproved).length, icon: <CheckCircle />, color: 'bg-artloop-maroon' },
             { label: 'Revenue', val: `₹${orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0)}`, icon: <TrendingUp />, color: 'bg-green-600' },
           ].map((s, i) => (
             <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-artloop-clay/10 flex items-center space-x-4">
                <div className={`${s.color} p-4 rounded-2xl text-white`}>{s.icon}</div>
                <div>
                   <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{s.label}</p>
                   <p className="text-2xl font-bold text-artloop-brown">{s.val}</p>
                </div>
             </div>
           ))}
        </div>

        <div className="bg-white rounded-[2rem] shadow-xl border border-artloop-clay/10 overflow-hidden">
           {/* Tab Navigation */}
           <div className="flex border-b border-artloop-clay/10 px-8">
              {['Users', 'Artisans', 'Products', 'Orders', 'Reviews', 'Analytics'].map(tab => (
                 <button 
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  className={`py-6 px-8 font-bold text-sm uppercase tracking-widest transition-all border-b-4 ${activeTab === tab.toLowerCase() ? 'border-artloop-maroon text-artloop-maroon' : 'border-transparent text-gray-400'}`}
                 >
                   {tab}
                 </button>
              ))}
           </div>

           <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                 <h3 className="text-2xl font-serif font-bold text-artloop-brown capitalize">{activeTab} Management</h3>
                 <div className="relative">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 border border-artloop-clay/20 rounded-full text-sm" placeholder={`Search ${activeTab}...`} />
                 </div>
              </div>

              <div className="overflow-x-auto">
                 <table className="w-full">
                    <thead>
                       <tr className="text-left text-xs font-bold text-gray-400 uppercase border-b border-gray-50">
                          <th className="py-4 px-4">Name/Details</th>
                          <th className="py-4 px-4">Status</th>
                          <th className="py-4 px-4">Role</th>
                          <th className="py-4 px-4 text-right">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                       {(activeTab === 'users' || activeTab === 'artisans') ? 
                         filteredUsers.filter(u => activeTab === 'artisans' ? u.role === 'artisan' : true).map(u => (
                           <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                              <td className="py-6 px-4">
                                 <p className="font-bold text-artloop-brown">{u.name}</p>
                                 <p className="text-xs text-gray-400">{u.email}</p>
                              </td>
                              <td className="py-6 px-4">
                                 {u.role === 'artisan' ? (
                                    u.artisanDetails?.isApproved ? 
                                    <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100 italic">Approved</span> :
                                    <span className="text-xs font-bold text-artloop-maroon bg-red-50 px-3 py-1 rounded-full border border-red-100 italic">Pending Approval</span>
                                 ) : (
                                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Active Buyer</span>
                                 )}
                              </td>
                              <td className="py-6 px-4">
                                 <span className="text-xs font-bold opacity-60 uppercase">{u.role}</span>
                              </td>
                              <td className="py-6 px-4 text-right">
                                 <div className="flex justify-end space-x-2">
                                    {u.role === 'artisan' && !u.artisanDetails?.isApproved && (
                                       <button onClick={() => approveArtisan(u._id)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg" title="Approve">
                                         <CheckCircle className="w-5 h-5" />
                                       </button>
                                    )}
                                    <button onClick={() => deleteUser(u._id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg" title="Delete">
                                       <XCircle className="w-5 h-5" />
                                    </button>
                                 </div>
                              </td>
                           </tr>
                         ))
                       : activeTab === 'products' ? 
                         filteredProducts.map(p => (
                            <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                               <td className="py-6 px-4">
                                  <p className="font-bold text-artloop-brown">{p.name}</p>
                                  <p className="text-xs text-gray-400">₹{p.price}</p>
                               </td>
                               <td className="py-6 px-4">
                                  <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100 italic">Stock: {p.stock || 10}</span>
                               </td>
                               <td className="py-6 px-4">
                                  <span className="text-xs font-bold opacity-60 uppercase">{p.category}</span>
                               </td>
                               <td className="py-6 px-4 text-right">
                                  <button onClick={() => deleteProduct(p._id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg" title="Delete">
                                    <XCircle className="w-5 h-5" />
                                  </button>
                               </td>
                            </tr>
                         ))
                       : activeTab === 'orders' ? filteredOrders.map(o => (
                            <tr key={o._id} className="hover:bg-gray-50 transition-colors">
                               <td className="py-6 px-4">
                                  <p className="font-bold text-artloop-brown">{o._id}</p>
                                  <p className="text-xs text-gray-400">Total: ₹{o.totalAmount}</p>
                               </td>
                               <td className="py-6 px-4">
                                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{o.status || 'Pending'}</span>
                               </td>
                               <td className="py-6 px-4">
                                  <span className="text-xs font-bold opacity-60 uppercase">{o.paymentMethod || 'COD'}</span>
                               </td>
                               <td className="py-6 px-4 text-right">
                                  <select value={o.status || 'Pending'} onChange={(e) => updateOrderStatus(o._id, e.target.value)} className="text-xs border rounded px-2 py-1">
                                    <option value="Pending">Pending</option>
                                    <option value="Processing">Processing</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Cancelled">Cancelled</option>
                                  </select>
                               </td>
                            </tr>
                         )) : activeTab === 'reviews' ? filteredReviews.map(r => (
                            <tr key={r._id} className="hover:bg-gray-50 transition-colors">
                               <td className="py-6 px-4">
                                  <p className="font-bold text-artloop-brown">"{r.comment}"</p>
                                  <p className="text-xs text-gray-400">by {r.user?.name || 'Unknown User'}</p>
                               </td>
                               <td className="py-6 px-4">
                                  <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">Rating: {r.rating}/5</span>
                               </td>
                               <td className="py-6 px-4">
                                  <span className="text-xs font-bold opacity-60 uppercase">{r.product?.name || 'Deleted Product'}</span>
                               </td>
                               <td className="py-6 px-4 text-right">
                                  <button onClick={() => deleteReview(r._id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg" title="Delete Review">
                                     <XCircle className="w-5 h-5" />
                                  </button>
                               </td>
                            </tr>
                         )) : (
                           <tr>
                             <td className="py-6 px-4" colSpan={4}>
                               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                 <div className="p-4 border rounded-xl">
                                   <p className="text-sm text-gray-500">Users</p>
                                   <p className="text-2xl font-bold">{users.length}</p>
                                 </div>
                                 <div className="p-4 border rounded-xl">
                                   <p className="text-sm text-gray-500">Products</p>
                                   <p className="text-2xl font-bold">{products.length}</p>
                                 </div>
                                 <div className="p-4 border rounded-xl">
                                   <p className="text-sm text-gray-500">Orders</p>
                                   <p className="text-2xl font-bold">{orders.length}</p>
                                 </div>
                               </div>
                             </td>
                           </tr>
                         )
                       }
                    </tbody>
                 </table>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
