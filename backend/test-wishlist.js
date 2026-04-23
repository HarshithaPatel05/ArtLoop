const mongoose = require('mongoose');
const Wishlist = require('./models/Wishlist');
const Product = require('./models/Product');
const User = require('./models/User');

mongoose.connect('mongodb://127.0.0.1:27017/artloop', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const user = await User.findOne({ email: 'admin@artloop.com' });
    let wishlist = await Wishlist.findOne({ userId: user._id });
    if (!wishlist) {
      wishlist = await Wishlist.create({ userId: user._id, products: [] });
    }
    
    console.log("Raw Wishlist Products:", wishlist.products);
    
    await wishlist.populate('products');
    console.log("Populated Wishlist Products:", wishlist.products);
    
    process.exit(0);
  });
