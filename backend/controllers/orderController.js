const Order = require('../models/Order');
const Product = require('../models/Product');

exports.addOrderItems = async (req, res) => {
  try {
    const { products, shippingAddress, totalAmount, paymentMethod } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    const normalizedAddress = {
      address: shippingAddress?.address || shippingAddress?.street || '',
      city: shippingAddress?.city || '',
      zipCode: shippingAddress?.zipCode || '',
      phone: shippingAddress?.phone || ''
    };

    const order = new Order({
      userId: req.user._id,
      products,
      shippingAddress: normalizedAddress,
      totalAmount,
      paymentMethod
    });

    const createdOrder = await order.save();

    // Deduct stock
    for (const item of products) {
      const product = await Product.findById(item.productId || item._id);
      if (product) {
        product.stock = Math.max(0, (product.stock || 0) - item.quantity);
        await product.save();
      }
    }

    return res.status(201).json(createdOrder);
  } catch (error) {
    console.error('[ORDERS] create error:', error.message);
    return res.status(500).json({ message: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('userId', 'name email');
    if (order) {
      return res.json(order);
    }
    return res.status(404).json({ message: 'Order not found' });
  } catch (error) {
    console.error('[ORDERS] getById error:', error.message);
    return res.status(500).json({ message: error.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id });
    return res.json(orders);
  } catch (error) {
    console.error('[ORDERS] myOrders error:', error.message);
    return res.status(500).json({ message: error.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('userId', 'id name');
    return res.json(orders);
  } catch (error) {
    console.error('[ORDERS] getOrders error:', error.message);
    return res.status(500).json({ message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.status = req.body.status || order.status;
      const updatedOrder = await order.save();
      return res.json(updatedOrder);
    }
    return res.status(404).json({ message: 'Order not found' });
  } catch (error) {
    console.error('[ORDERS] updateStatus error:', error.message);
    return res.status(500).json({ message: error.message });
  }
};

exports.checkPurchase = async (req, res) => {
  try {
    const hasPurchased = await Order.findOne({
      userId: req.user._id,
      status: 'Delivered',
      'products.productId': req.params.productId
    });
    return res.json({ hasPurchased: !!hasPurchased });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
