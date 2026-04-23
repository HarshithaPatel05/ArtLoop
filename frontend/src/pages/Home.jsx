import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, ShieldCheck, Globe } from "lucide-react";
import { motion } from "framer-motion";
import api from "../services/api";

const Home = () => {
  const [lang, setLang] = useState("en");
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await api.get('/api/products?limit=8');
        setFeatured(Array.isArray(data) ? data : []);
      } catch (err) {
        if (err.response?.status >= 400) {
          setError('Failed to load products');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const categories = [
    { name: "Paintings", img: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=400" },
    { name: "Jewelry", img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=400" },
    { name: "Handloom", img: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=400" },
    { name: "Home Decor", img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=400" },
    { name: "Tribal Crafts", img: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=400" },
    { name: "Pottery", img: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=400" },
  ];

  return (
    <div className="bg-[#faf9f6] min-h-screen font-sans">
      
      {/* LANGUAGE TOGGLE */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setLang((prev) => (prev === "en" ? "hi" : "en"))}
          className="bg-white/80 backdrop-blur-md shadow-lg border border-gray-200 text-sm font-bold px-4 py-2 rounded-full hover:bg-gray-50 transition-all flex items-center gap-2"
        >
          <Globe className="w-4 h-4 text-gray-500" />
          {lang === "en" ? "हिंदी" : "English"}
        </button>
      </div>

      {/* HERO SECTION */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-red-50 -z-10" />
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-b from-orange-100/40 to-transparent rounded-bl-full blur-3xl -z-10" />
        
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100/50 text-orange-800 text-sm font-bold mb-8 border border-orange-200"
          >
            <Sparkles className="w-4 h-4" />
            <span>{lang === "en" ? "Authentic Indian Heritage" : "प्रामाणिक भारतीय विरासत"}</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-serif font-bold tracking-tight text-gray-900 mb-6"
          >
            {lang === "en" ? "Discover " : "खोजिए "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-700 to-orange-600">
              {lang === "en" ? "Handmade Art" : "हस्तनिर्मित कला"}
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto mb-10"
          >
            {lang === "en"
              ? "Support local artisans by bringing their beautiful, culturally-rich masterpieces directly into your home."
              : "कारीगरों से सीधे आपके घर तक सुंदर और सांस्कृतिक रूप से समृद्ध उत्कृष्ट कृतियां।"}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex justify-center gap-4"
          >
            <Link
              to="/shop"
              className="group inline-flex items-center justify-center bg-gray-900 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-black transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
            >
              Explore Collection
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto py-24 px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-serif font-bold text-gray-900">Curated Categories</h2>
            <p className="text-gray-500 mt-2">Explore distinct art forms from across India</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((cat, i) => (
            <motion.button 
              whileHover={{ y: -5 }}
              key={i} 
              onClick={() => navigate(`/shop?category=${cat.name}`)} 
              className="group flex flex-col items-center p-4 rounded-2xl hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-gray-100"
            >
              <div className="w-32 h-32 rounded-full overflow-hidden mb-4 shadow-md ring-4 ring-orange-50 group-hover:ring-orange-100 transition-all">
                <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <p className="font-bold text-gray-900 group-hover:text-red-700 transition-colors">{cat.name}</p>
            </motion.button>
          ))}
        </div>
      </section>

      {/* VALUE PROPS MOVED TO FOOTER */}

      {/* FEATURED PRODUCTS */}
      <section className="max-w-7xl mx-auto py-24 px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-serif font-bold text-gray-900">Featured Masterpieces</h2>
            <p className="text-gray-500 mt-2">Handpicked creations just for you</p>
          </div>
          <Link to="/shop" className="text-red-700 font-bold hover:underline hidden md:block">View all products &rarr;</Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700"></div></div>
        ) : error ? (
          <p className="text-center text-red-500 py-10">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featured.map((p) => (
              <Link key={p._id} to={`/products/${p._id}`} className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300">
                <div className="relative h-64 overflow-hidden">
                  <img src={p.images?.[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider text-gray-800">
                    {p.category}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg text-gray-900 truncate mb-1 group-hover:text-red-700 transition-colors">{p.name}</h3>
                  <p className="text-gray-500 text-sm mb-4">By {p.artisanId?.name || p.artisanName}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xl font-bold text-gray-900">₹{p.price}</p>
                    <span className="text-red-700 font-medium text-sm group-hover:underline">View details</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* CTA SECTION */}
      <section className="bg-gradient-to-br from-red-800 to-orange-900 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1583091931558-ec373979ea44')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">Are you an artisan?</h2>
          <p className="text-xl text-red-100 mb-10 max-w-2xl mx-auto">
            Join thousands of creators sharing their craft with the world. Get fair prices and a global audience.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center bg-white text-red-900 font-bold px-8 py-4 rounded-full text-lg hover:bg-orange-50 hover:shadow-2xl transition-all hover:-translate-y-1"
          >
            Start Selling Today
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Home;