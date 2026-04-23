import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Star, ArrowLeft, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [recommended, setRecommended] = useState([]);
  const [canReview, setCanReview] = useState(false);

  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const handleWishlistToggle = async () => {
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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/api/products/${id}`);
        setProduct(data);
        const recRes = await api.get(`/api/products?category=${data.category}`);
        setRecommended((recRes.data || []).filter((p) => p._id !== data._id).slice(0, 4));
      } catch {
        toast.error('Failed to load product');
      }
      
      if (user && user.role !== 'artisan') {
        try {
          const checkRes = await api.get(`/api/orders/check-purchase/${id}`);
          setCanReview(checkRes.data.hasPurchased);
        } catch (err) {
          console.error(err);
        }
      }
      
      setLoading(false);
    };
    fetchProduct();
  }, [id, user]);

  const submitReview = async () => {
    try {
      if (!localStorage.getItem('token')) {
        navigate('/login');
        return;
      }
      await api.post(`/api/reviews`, { productId: id, rating, comment });

      toast.success('Review added!');
      window.location.reload();

    } catch (error) {
      toast.error(error.response?.data?.message || 'Error submitting review');
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!product) return <div className="text-center py-20">Product not found</div>;

  return (
    <div className="min-h-screen bg-artloop-earth pb-20">
      <div className="container mx-auto px-6 py-8">

        <Link to="/shop" className="inline-flex items-center text-artloop-maroon font-bold mb-8 hover:underline">
          <ArrowLeft className="w-5 h-5 mr-2" /> Back to Shop
        </Link>

        <div className="grid md:grid-cols-2 gap-12">

          {/* ✅ IMAGE FIX */}
          <div>
            <img
              src={product.images?.[0]}
              alt={product.name}
              className="w-full rounded-2xl shadow-lg"
            />
          </div>

          {/* DETAILS */}
          <div>
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>

            {/* ⭐ RATING */}
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-5 h-5 ${i < Math.round(product.averageRating) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} />
              ))}
              <span className="ml-2 text-gray-600">({product.numReviews} reviews)</span>
            </div>

            <p className="text-2xl font-bold mb-4">₹{product.price}</p>
            <p className="mb-2 font-bold text-sm">
              {product.stock > 0 ? (
                <span className="text-green-600">In Stock: {product.stock} units left</span>
              ) : (
                <span className="text-red-500">Out of Stock</span>
              )}
            </p>
            <p className="mb-6">{product.description}</p>

            {/* ACTION BUTTONS */}
            {user?.role !== 'artisan' && (
              <div className="flex gap-4">
                <button
                  onClick={async () => {
                    try {
                      if (!localStorage.getItem('token')) {
                        navigate('/login');
                        return;
                      }
                      if (product.stock > 0) {
                        await addToCart(product);
                      }
                    } catch (e) {
                      console.error('Error adding to cart', e);
                    }
                  }}
                  disabled={product.stock === 0}
                  className={`px-6 py-3 rounded-lg flex-1 text-white font-bold transition-colors ${
                    product.stock === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800'
                  }`}
                >
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>

                <button
                  onClick={handleWishlistToggle}
                  className="border border-red-500 text-red-500 p-3 rounded-lg hover:bg-red-50"
                >
                  <Heart className={`w-6 h-6 ${wishlist.some(item => item._id === product._id) ? 'fill-red-500' : ''}`} />
                </button>
              </div>
            )}

            <p className="mt-4 text-sm text-gray-500">
              By {product.artisanId?.name || product.artisanName || 'Artisan'}
            </p>

            {/* STORY */}
            <div className="mt-10 space-y-3">
              <p><b>Origin:</b> {product.origin}</p>
              <p><b>Tradition:</b> {product.tradition}</p>
              <p><b>Cultural Meaning:</b> {product.culturalMeaning}</p>
              <p>
                <b>Authenticity Check:</b>{' '}
                {product.origin && product.tradition ? 'Likely Real' : 'Needs Verification'}
              </p>
            </div>
            <button
              onClick={() => toast.success('Custom order request sent (demo)')}
              className="mt-6 border border-black px-5 py-2 rounded-lg"
            >
              Request Custom Order
            </button>
          </div>
        </div>

        {/* ⭐ REVIEWS SECTION */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-6">Reviews</h2>

          {product.reviews?.length === 0 && <p>No reviews yet</p>}

          {product.reviews?.map((rev) => (
            <div key={rev._id} className="border p-4 mb-4 rounded-lg">
              <p className="font-bold">{rev.name}</p>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < rev.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} />
                ))}
              </div>
              <p>{rev.comment}</p>
            </div>
          ))}
        </div>

        {/* ✍️ ADD REVIEW */}
        {user && canReview ? (
          <div className="mt-10">
            <h3 className="text-2xl font-bold mb-4">Write a Review</h3>

            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="border p-2 mb-4 w-full"
            >
              <option value="">Select Rating</option>
              <option value="1">1 - Bad</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5 - Excellent</option>
            </select>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your review..."
              className="border p-2 w-full mb-4"
            />

            <button
              onClick={submitReview}
              className="bg-green-600 text-white px-6 py-2 rounded"
            >
              Submit Review
            </button>
          </div>
        ) : (
          user && user.role !== 'artisan' && (
            <div className="mt-10 p-4 bg-gray-100 rounded-lg text-gray-600">
              You must purchase and receive this product before leaving a review.
            </div>
          )
        )}

      </div>
      {recommended.length > 0 && (
        <div className="container mx-auto px-6 mt-10">
          <h3 className="text-2xl font-bold mb-4">Similar Art You May Like</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recommended.map((item) => (
              <Link key={item._id} to={`/product/${item._id}`} className="bg-white rounded-xl p-3 shadow-sm">
                <img src={item.images?.[0]} alt={item.name} className="w-full h-28 object-cover rounded-lg" />
                <p className="font-semibold mt-2">{item.name}</p>
                <p className="text-sm text-gray-500">₹{item.price}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;