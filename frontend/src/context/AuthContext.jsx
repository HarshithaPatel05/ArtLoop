import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { toast } from 'react-hot-toast';

const AuthContext = createContext({ user: null });

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');

      if (storedToken) {
        try {
          const { data } = await api.get('/api/auth/me');
          setUser(data);
          setToken(storedToken);
          localStorage.setItem('userInfo', JSON.stringify(data));
        } catch {
          // invalid token
          localStorage.removeItem('token');
          localStorage.removeItem('userInfo');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/api/auth/login', { email, password });
    setToken(data.token);
    localStorage.setItem('token', data.token);
    
    // Fetch profile after login
    const profileRes = await api.get('/api/auth/me', {
      headers: { 'x-auth-token': data.token }
    });
    setUser(profileRes.data);
    localStorage.setItem('userInfo', JSON.stringify(profileRes.data));
    
    return data;
  };

  const register = async (userData) => {
    const { data } = await api.post('/api/auth/register', userData);
    setToken(data.token);
    localStorage.setItem('token', data.token);
    
    // Fetch profile after register
    const profileRes = await api.get('/api/auth/me', {
      headers: { 'x-auth-token': data.token }
    });
    setUser(profileRes.data);
    localStorage.setItem('userInfo', JSON.stringify(profileRes.data));
    
    return data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
