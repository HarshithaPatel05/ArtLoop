import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Package, ShoppingBag, LogOut, PlusCircle, Edit, Trash2 } from 'lucide-react';

const ArtisanDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('overview'); // overview, products, orders
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: 'Paintings',
    description: '',
    image: '',
    regionOfOrigin: '',
    culturalSignificance: '',
    artisanStory: '',
    stock: 10
  });

  const fetchMyProducts = useCallback(async () => {
    try {
      const { data } = await api.get('/api/products');
      const myProducts = (data || []).filter((p) => p.artisanId?._id === user?._id);
      setProducts(myProducts);
    } catch {
      toast.error('Failed to fetch products');
    }
  }, [user?._id]);

  const fetchMyOrders = useCallback(async () => {
    try {
      const { data } = await api.get('/api/orders/myorders');
      setOrders(data || []);
    } catch {
      setOrders([]);
    }
  }, []);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }
    if (user?.role && user.role !== 'artisan' && user.role !== 'admin') {
      navigate('/');
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchMyProducts();
    fetchMyOrders();
  }, [fetchMyProducts, fetchMyOrders, navigate, user?.role]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/products', {
        name: newProduct.name,
        price: Number(newProduct.price),
        category: newProduct.category,
        description: newProduct.description,
        images: [newProduct.image],
        origin: newProduct.regionOfOrigin,
        culturalMeaning: newProduct.culturalSignificance,
        tradition: newProduct.artisanStory,
        stock: Number(newProduct.stock)
      });
      toast.success('Product added successfully!');
      setShowAddForm(false);
      setNewProduct({
        name: '', price: '', stock: 10, category: 'Paintings', description: '', image: '', regionOfOrigin: '', culturalSignificance: '', artisanStory: ''
      });
      fetchMyProducts();
    } catch {
      toast.error('Failed to add product');
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!editingProduct?._id) return;
    try {
      await api.put(`/api/products/${editingProduct._id}`, {
        name: newProduct.name,
        price: Number(newProduct.price),
        category: newProduct.category,
        description: newProduct.description,
        images: [newProduct.image],
        origin: newProduct.regionOfOrigin,
        culturalMeaning: newProduct.culturalSignificance,
        tradition: newProduct.artisanStory,
        stock: Number(newProduct.stock)
      });
      toast.success('Product updated successfully!');
      setShowAddForm(false);
      setEditingProduct(null);
      fetchMyProducts();
    } catch {
      toast.error('Failed to update product');
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm('Are you sure you want to delete this product?')) {
        try {
            await api.delete(`/api/products/${id}`);
            toast.success('Product deleted!');
            fetchMyProducts();
        } catch {
            toast.error('Failed to delete product');
        }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-artloop-brown text-artloop-earth hidden lg:flex flex-col p-6 sticky top-0 h-screen">
          <div className="mb-12">
            <h2 className="text-2xl font-serif font-bold text-artloop-saffron">Artisan Portal</h2>
            <p className="text-xs opacity-50 uppercase tracking-widest mt-1">Artisan Dashboard</p>
          </div>
          
          <nav className="flex-grow space-y-4">
             <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all ${activeTab === 'overview' ? 'bg-white/10 font-bold' : 'hover:bg-white/5 opacity-60'}`}>
               <LayoutDashboard className="w-5 h-5" />
               <span>Overview</span>
             </button>
             <button onClick={() => setActiveTab('products')} className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all ${activeTab === 'products' ? 'bg-white/10 font-bold' : 'hover:bg-white/5 opacity-60'}`}>
               <Package className="w-5 h-5" />
               <span>My Products</span>
             </button>
             <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all ${activeTab === 'orders' ? 'bg-white/10 font-bold' : 'hover:bg-white/5 opacity-60'}`}>
               <ShoppingBag className="w-5 h-5" />
               <span>Orders</span>
             </button>
          </nav>

          <button onClick={logout} className="flex items-center space-x-3 p-3 text-red-400 hover:text-red-300">
             <LogOut className="w-5 h-5" />
             <span>Logout</span>
          </button>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-6 lg:p-12">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-serif font-bold text-artloop-brown">Namaste, {user?.name}!</h1>
            <p className="text-artloop-clay font-medium">Manage your craft collection and track your sales.</p>
          </div>
          <button 
            onClick={() => setShowAddForm(true)}
            className="btn-primary flex items-center justify-center py-3 px-6 shadow-lg"
          >
            <PlusCircle className="mr-2" /> List New Product
          </button>
        </header>

        {/* Stats Cards */}
        {(activeTab === 'overview' || activeTab === 'products') && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
             <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Total Products</p>
                <p className="text-4xl font-serif font-bold text-artloop-brown">{products.length}</p>
             </div>
             <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Active Orders</p>
                <p className="text-4xl font-serif font-bold text-artloop-maroon">{orders.length}</p>
             </div>
             <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Total Earnings</p>
                <p className="text-4xl font-serif font-bold text-green-600">₹{orders.reduce((acc, order) => acc + order.totalAmount, 0)}</p>
             </div>
          </div>
        )}

        {/* Products Table */}
        {(activeTab === 'overview' || activeTab === 'products') && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-12">
             <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-artloop-brown">Product Inventory</h3>
                {activeTab === 'overview' && (
                  <button onClick={() => setActiveTab('products')} className="text-sm font-bold text-artloop-maroon hover:underline">View All</button>
                )}
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                 <thead className="bg-gray-50 text-xs font-bold text-gray-400 uppercase tracking-widest">
                   <tr>
                     <th className="px-8 py-4">Product</th>
                     <th className="px-8 py-4">Category</th>
                     <th className="px-8 py-4">Price</th>
                     <th className="px-8 py-4">Stock</th>
                     <th className="px-8 py-4 text-right">Actions</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-50">
                   {products.map(product => (
                      <tr key={product._id} className="hover:bg-artloop-earth/20 transition-colors group">
                         <td className="px-8 py-6">
                           <div className="flex items-center space-x-4">
                              <img src={product.images?.[0] || product.image} className="w-12 h-12 rounded-lg object-cover" alt="" />
                              <span className="font-bold text-artloop-brown">{product.name}</span>
                           </div>
                         </td>
                         <td className="px-8 py-6">
                           <span className="px-3 py-1 bg-artloop-maroon/5 text-artloop-maroon rounded-full text-xs font-bold uppercase">{product.category}</span>
                         </td>
                         <td className="px-8 py-6 font-bold">₹{product.price}</td>
                         <td className="px-8 py-6">
                           <span className={product.stock < 5 ? 'text-red-500 font-bold' : 'text-green-600 font-bold'}>{product.stock || 10} units</span>
                         </td>
                         <td className="px-8 py-6 text-right">
                            <div className="flex justify-end space-x-2">
                               <button onClick={() => {
                                 setEditingProduct(product);
                                 setNewProduct({
                                   name: product.name || '',
                                   price: product.price || '',
                                   category: product.category || 'Paintings',
                                   description: product.description || '',
                                   image: product.images?.[0] || '',
                                   regionOfOrigin: product.origin || '',
                                   culturalSignificance: product.culturalMeaning || '',
                                   artisanStory: product.tradition || '',
                                   stock: product.stock || 0
                                 });
                                 setShowAddForm(true);
                               }} className="p-2 text-artloop-clay hover:text-artloop-maroon hover:bg-artloop-maroon/5 rounded-lg transition-all">
                                 <Edit className="w-5 h-5" />
                               </button>
                               <button 
                                 onClick={() => handleDelete(product._id)}
                                 className="p-2 text-artloop-clay hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                               >
                                 <Trash2 className="w-5 h-5" />
                               </button>
                            </div>
                         </td>
                      </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        )}

        {/* Orders Table */}
        {(activeTab === 'overview' || activeTab === 'orders') && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
             <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-artloop-brown">Recent Orders</h3>
                {activeTab === 'overview' && (
                  <button onClick={() => setActiveTab('orders')} className="text-sm font-bold text-artloop-maroon hover:underline">View All</button>
                )}
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                 <thead className="bg-gray-50 text-xs font-bold text-gray-400 uppercase tracking-widest">
                   <tr>
                     <th className="px-8 py-4">Order ID</th>
                     <th className="px-8 py-4">Customer</th>
                     <th className="px-8 py-4">Total</th>
                     <th className="px-8 py-4">Status</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-50">
                   {orders.length === 0 ? (
                     <tr>
                       <td colSpan="4" className="px-8 py-6 text-center text-gray-500">No orders yet.</td>
                     </tr>
                   ) : orders.map(order => (
                      <tr key={order._id} className="hover:bg-artloop-earth/20 transition-colors">
                         <td className="px-8 py-6 font-mono text-sm text-gray-500">#{order._id.slice(-6)}</td>
                         <td className="px-8 py-6 font-bold">{order.userId?.name || 'Customer'}</td>
                         <td className="px-8 py-6 font-bold text-green-600">₹{order.totalAmount}</td>
                         <td className="px-8 py-6">
                           <span className="px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-xs font-bold">{order.status || 'Processing'}</span>
                         </td>
                      </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        )}
      </main>

      {/* Add Product Modal */}
      <AnimatePresence>
        {showAddForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <div
               onClick={() => setShowAddForm(false)}
               className="absolute inset-0 bg-artloop-brown/80 backdrop-blur-sm"
            ></div>
            <div
              className="relative w-full max-w-4xl bg-white rounded-[2rem] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="p-8 md:p-12">
                <div className="flex justify-between items-center mb-10">
                  <h2 className="text-4xl font-serif font-bold text-artloop-brown">{editingProduct ? 'Edit Masterpiece' : 'Add New Masterpiece'}</h2>
                  <button onClick={() => setShowAddForm(false)} className="text-artloop-clay hover:text-artloop-maroon font-bold text-2xl">&times;</button>
                </div>

                <form onSubmit={editingProduct ? handleEdit : handleCreate} className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-artloop-brown mb-2 uppercase tracking-wider">Product Name</label>
                      <input 
                        required
                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-artloop-maroon/20"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                        placeholder="e.g. Traditional Zardosi Wall Hanging"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-artloop-brown mb-2 uppercase tracking-wider">Price (₹)</label>
                        <input 
                          type="number"
                          required
                          className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-artloop-maroon/20"
                          value={newProduct.price}
                          onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-artloop-brown mb-2 uppercase tracking-wider">Stock (Units)</label>
                        <input 
                          type="number"
                          required
                          className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-artloop-maroon/20"
                          value={newProduct.stock}
                          onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-artloop-brown mb-2 uppercase tracking-wider">Category</label>
                        <select 
                          className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-artloop-maroon/20"
                          value={newProduct.category}
                          onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                        >
                          <option>Paintings</option>
                          <option>Jewelry</option>
                          <option>Handloom</option>
                          <option>Home Decor</option>
                          <option>Tribal Crafts</option>
                          <option>Pottery</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-artloop-brown mb-2 uppercase tracking-wider">Product Image URL</label>
                      <input 
                        required
                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-artloop-maroon/20"
                        value={newProduct.image}
                        onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                        placeholder="https://images.unsplash.com/..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-artloop-brown mb-2 uppercase tracking-wider">Region of Origin</label>
                      <input 
                        required
                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-artloop-maroon/20"
                        value={newProduct.regionOfOrigin}
                        onChange={(e) => setNewProduct({...newProduct, regionOfOrigin: e.target.value})}
                        placeholder="e.g. Kutch, Gujarat"
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-artloop-brown mb-2 uppercase tracking-wider">Description</label>
                      <textarea 
                        rows="3"
                        required
                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-artloop-maroon/20"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-artloop-brown mb-2 uppercase tracking-wider">Cultural Significance</label>
                      <textarea 
                        rows="3"
                        required
                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-artloop-maroon/20"
                        value={newProduct.culturalSignificance}
                        onChange={(e) => setNewProduct({...newProduct, culturalSignificance: e.target.value})}
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-artloop-brown mb-2 uppercase tracking-wider">Product Story</label>
                      <textarea 
                        rows="2"
                        required
                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-artloop-maroon/20"
                        value={newProduct.artisanStory}
                        onChange={(e) => setNewProduct({...newProduct, artisanStory: e.target.value})}
                        placeholder="Tell the buyers why this piece is special..."
                      ></textarea>
                    </div>
                    <button type="submit" className="w-full btn-primary py-4 text-xl shadow-xl">
                       {editingProduct ? 'Update Product' : 'Publish to Marketplace'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ArtisanDashboard;
