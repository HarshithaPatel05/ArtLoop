const Cart = require('../models/Cart');

// GET CART
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id })
      .populate('items.product');

    if (!cart) {
      return res.json({ items: [] });
    }

    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ADD TO CART
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ msg: 'User not authenticated' });
    }

    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      cart = new Cart({
        userId: req.user.id,
        items: [{ product: productId, quantity: quantity || 1 }],
      });
    } else {
      const index = cart.items.findIndex(
        item => item.product.toString() === productId
      );

      if (index > -1) {
        cart.items[index].quantity += quantity || 1;
      } else {
        cart.items.push({
          product: productId,
          quantity: quantity || 1,
        });
      }
    }

    await cart.save();
    res.json(cart);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// REMOVE ITEM
exports.removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) return res.status(404).json({ msg: 'Cart not found' });

    cart.items = cart.items.filter(
      item => item._id.toString() !== req.params.id
    );

    await cart.save();
    res.json(cart);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE CART ITEM QUANTITY
exports.updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) return res.status(404).json({ msg: 'Cart not found' });

    const item = cart.items.id(req.params.id);
    if (!item) return res.status(404).json({ msg: 'Item not found' });

    item.quantity = quantity;
    await cart.save();
    
    // Send populated cart
    const updatedCart = await Cart.findById(cart._id).populate('items.product');
    res.json(updatedCart);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CLEAR CART
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.json({ items: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};