import React from 'react';//component used in my-profile page
import { useAuth } from '../context/AuthContext';//used to get the user data
import { Link } from 'react-router-dom';//to navigate to different pages
import { User, Package, Heart, LogOut } from 'lucide-react';//icons used in the profile page

const Profile = () => {// profile page component
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-artloop-earth py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        <h2 className="text-4xl font-serif font-bold text-artloop-brown mb-8 flex items-center">
          <User className="mr-3 w-10 h-10" /> My Profile
        </h2>

        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-artloop-clay/10">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12 border-b border-gray-100 pb-12">
             <div className="w-32 h-32 rounded-full bg-artloop-maroon/10 flex items-center justify-center text-5xl font-serif font-bold text-artloop-maroon">
               {user?.name?.charAt(0).toUpperCase()}
             </div>
             <div className="text-center md:text-left">
                <h3 className="text-3xl font-bold text-artloop-brown">{user?.name}</h3>
                <p className="text-lg text-artloop-clay mb-2">{user?.email}</p>
                <span className="inline-block px-4 py-1 bg-gray-100 rounded-full text-sm font-bold uppercase tracking-wider text-gray-600">
                  {user?.role || 'Buyer'}
                </span>
             </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
             <Link to="/orders" className="flex items-center p-6 border border-gray-100 rounded-2xl hover:border-artloop-maroon hover:shadow-md transition-all group">
                <div className="p-4 bg-artloop-maroon/5 rounded-full text-artloop-maroon group-hover:bg-artloop-maroon group-hover:text-white transition-colors">
                  <Package className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <h4 className="font-bold text-lg text-artloop-brown">My Orders</h4>
                  <p className="text-sm text-gray-500">View and track your purchases</p>
                </div>
             </Link>

             <Link to="/wishlist" className="flex items-center p-6 border border-gray-100 rounded-2xl hover:border-red-500 hover:shadow-md transition-all group">
                <div className="p-4 bg-red-50 rounded-full text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors">
                  <Heart className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <h4 className="font-bold text-lg text-artloop-brown">Wishlist</h4>
                  <p className="text-sm text-gray-500">View your saved items</p>
                </div>
             </Link>
          </div>

          <div className="mt-12 text-center md:text-left">
             <button onClick={logout} className="flex items-center justify-center md:justify-start space-x-2 text-red-500 hover:text-red-600 font-bold w-full md:w-auto p-4 bg-red-50 rounded-xl hover:bg-red-100 transition-colors">
               <LogOut className="w-5 h-5" />
               <span>Sign Out</span>
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
