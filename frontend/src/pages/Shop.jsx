import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { SlidersHorizontal, Heart, Star } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { user } = useAuth();

  // Extract param using location.search explicitly
  const params = new URLSearchParams(location.search);
  const categoryParam = params.get('category') || '';
  
  const [category, setCategory] = useState(categoryParam);
  const [sort, setSort] = useState('latest');
  const [priceRange, setPriceRange] = useState('0-100000');
  
  // Re-sync local state if URL changes
  useEffect(() => {
    const freshParams = new URLSearchParams(location.search);
    setCategory(freshParams.get('category') || '');
  }, [location.search]);
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['Paintings', 'Jewelry', 'Handloom', 'Home Decor', 'Tribal Crafts', 'Pottery'];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const params = new URLSearchParams(location.search);
        const categoryValue = params.get('category') || '';
        const search = params.get('search') || '';
        const { data } = await api.get('/api/products', {
          params: {
            ...(categoryValue && { category: categoryValue }),
            ...(search && { search }),
            sort,
            priceRange,
          },
        });
        console.log('Products received:', data);
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        if (err.response?.status >= 400) {
          setError('Failed to load products');
          toast.error('Failed to load products');
        }
        console.error(err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [location.search, sort, priceRange]);

  const handleCategory = (cat) => {
    setCategory(cat);
    navigate(cat ? `/shop?category=${cat}` : '/shop');
  };

  const handleWishlistToggle = async (product) => {
    try {
      if (!localStorage.getItem('token')) {
        navigate('/login');
        return;
      }
      const inWishlist = wishlist.some(item => item._id === product._id);
      if (inWishlist) {
        await removeFromWishlist(product._id);
      } else {
        await addToWishlist(product._id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 py-8 max-w-7xl mx-auto">

      {/* TOP BAR */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 border px-4 py-2 rounded-lg"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </button>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border px-3 py-2 rounded-lg"
        >
          <option value="newest">Newest</option>
          <option value="price-low">Price Low</option>
          <option value="price-high">Price High</option>
        </select>
      </div>

      <div className="flex gap-8">

        {/* FILTERS */}
        {showFilters && (
          <div className="w-60 space-y-6">

            {/* CATEGORY */}
            <div>
              <h3 className="font-bold mb-2">Category</h3>
              {categories.map(cat => (
                <p
                  key={cat}
                  onClick={() => handleCategory(cat)}
                  className={`cursor-pointer ${category === cat ? 'font-bold text-black' : 'text-gray-500'}`}
                >
                  {cat}
                </p>
              ))}
            </div>

            {/* PRICE */}
            <div>
              <h3 className="font-bold mb-2">Price</h3>
              {[
                { label: 'All', value: '0-100000' },
                { label: 'Under ₹1000', value: '0-1000' },
                { label: '₹1000 - ₹5000', value: '1000-5000' },
                { label: 'Above ₹5000', value: '5000-100000' }
              ].map(r => (
                <p
                  key={r.value}
                  onClick={() => setPriceRange(r.value)}
                  className="cursor-pointer text-gray-500"
                >
                  {r.label}
                </p>
              ))}
            </div>

          </div>
        )}

        {/* PRODUCTS */}
        <div className="flex-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : products.length === 0 ? (
            <p>No products found</p>
          ) : (
            products.map(product => (
              <div key={product._id} className="group">

                <Link to={`/products/${product._id}`}>
                  <div className="relative">

                    {/* ✅ FIXED IMAGE */}
                    <img
                      src={product.images?.[0]}
                      alt={product.name}
                      className="w-full h-56 object-cover rounded-lg"
                    />

                    {user?.role !== 'artisan' && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleWishlistToggle(product);
                        }}
                        className="absolute top-2 right-2 bg-white p-2 rounded-full shadow"
                      >
                        <Heart className={`w-4 h-4 ${wishlist.some(item => item._id === product._id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                      </button>
                    )}
                  </div>
                </Link>

                <Link to={`/products/${product._id}`}>
                  <h3 className="mt-2 font-semibold">{product.name}</h3>

                  <p className="text-sm text-gray-500">
                    {product.artisanId?.name || 'Artisan'}
                  </p>

                  {/* ⭐ RATING */}
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    {product.averageRating || 0}
                    <span className="text-gray-400">({product.numReviews})</span>
                  </div>

                  <p className="font-bold mt-1">₹{product.price}</p>
                </Link>

              </div>
            ))
          )}

        </div>
      </div>
    </div>
  );
};

export default Shop;