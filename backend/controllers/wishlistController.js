const Wishlist = require('../models/Wishlist');

exports.getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ userId: req.user.id }).populate('products');

    if (!wishlist) {
      wishlist = await Wishlist.create({ userId: req.user.id, products: [] });
    }

    const validProducts = wishlist.products.filter(p => p != null);
    res.json(validProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addToWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ userId: req.user.id });

    if (!wishlist) {
      wishlist = await Wishlist.create({ userId: req.user.id, products: [] });
    }

    if (!wishlist.products.includes(req.params.id)) {
      wishlist.products.push(req.params.id);
    }

    await wishlist.save();
    await wishlist.populate('products');

    const validProducts = wishlist.products.filter(p => p != null);
    res.json(validProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.user.id });

    if (!wishlist) return res.json([]);

    wishlist.products = wishlist.products.filter(
      (p) => p.toString() !== req.params.id
    );

    await wishlist.save();
    await wishlist.populate('products');

    const validProducts = wishlist.products.filter(p => p != null);
    res.json(validProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};