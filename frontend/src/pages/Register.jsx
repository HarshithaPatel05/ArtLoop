import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer'
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      toast.success('Account created 🎉');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-200 via-orange-100 to-white px-4">

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md backdrop-blur-xl bg-white/60 border border-white/30 shadow-2xl rounded-2xl p-8"
      >

        <h2 className="text-3xl font-bold text-center text-gray-800">
          Join Artloop 🎨
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Discover & support artisans
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Name */}
          <div className="relative">
            <input
              name="name"
              required
              onChange={handleChange}
              placeholder=" "
              className="peer w-full px-4 pt-5 pb-2 border rounded-lg outline-none focus:ring-2 focus:ring-orange-300"
            />
            <label className="absolute left-4 top-2 text-gray-500 text-sm transition-all 
              peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base
              peer-focus:top-2 peer-focus:text-sm">
              Full Name
            </label>
          </div>

          {/* Email */}
          <div className="relative">
            <input
              name="email"
              type="email"
              required
              onChange={handleChange}
              placeholder=" "
              className="peer w-full px-4 pt-5 pb-2 border rounded-lg outline-none focus:ring-2 focus:ring-orange-300"
            />
            <label className="absolute left-4 top-2 text-gray-500 text-sm transition-all 
              peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base
              peer-focus:top-2 peer-focus:text-sm">
              Email
            </label>
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              onChange={handleChange}
              placeholder=" "
              className="peer w-full px-4 pt-5 pb-2 border rounded-lg outline-none focus:ring-2 focus:ring-orange-300"
            />
            <label className="absolute left-4 top-2 text-gray-500 text-sm transition-all 
              peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base
              peer-focus:top-2 peer-focus:text-sm">
              Password
            </label>

            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 cursor-pointer text-sm text-gray-500"
            >
              {showPassword ? 'Hide' : 'Show'}
            </span>
          </div>

          {/* Role */}
          <select
            name="role"
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-300 outline-none"
          >
            <option value="customer">Customer</option>
            <option value="artisan">Artisan</option>
          </select>

          <motion.button
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02 }}
            className="w-full bg-gradient-to-r from-orange-400 to-amber-500 text-white py-3 rounded-lg font-semibold shadow-lg"
          >
            Create Account
          </motion.button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-orange-500 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;