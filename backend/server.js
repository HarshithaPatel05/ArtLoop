require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// ✅ ENV
const PORT = process.env.PORT || 8000;

// ✅ CORS CONFIG
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = ['http://localhost:4001', 'http://localhost:5173', 'http://localhost:3000'];
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('vercel.app')) {
      callback(null, true);
    } else if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

// ✅ APPLY CORS (this alone is enough)
app.use(cors(corsOptions));

// ❌ REMOVE app.options COMPLETELY (this was causing crash)

// ✅ BODY PARSING
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ REQUEST LOGGER
app.use((req, res, next) => {
  console.log(`📌 ${req.method} ${req.url}`);
  next();
});

// ✅ ROOT ROUTE
app.get('/', (req, res) => {
  res.status(200).send('Artloop API is running...');
});

// ✅ ROUTES
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/wishlist', require('./routes/wishlistRoutes'));

// ✅ 404 HANDLER
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ✅ GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.error('❌ ERROR:', err.message);
  res.status(err.status || 500).json({
    message: err.message || 'Server error',
  });
});

// ✅ CONNECT DB + START SERVER
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ DB Error:', err.message);
    process.exit(1);
  });