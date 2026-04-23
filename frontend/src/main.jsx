import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import axios from 'axios'
import { API_BASE_URL } from './config/api'

// ✅ CONTEXTS IMPORT
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'

import './index.css'

axios.defaults.baseURL = API_BASE_URL

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WishlistProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </WishlistProvider>
  </React.StrictMode>,
)