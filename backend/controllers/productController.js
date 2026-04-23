const Product = require('../models/Product');
const Order = require('../models/Order');


exports.getProducts = async (req, res) => {
  try {
    const query = {};
    if (req.query.category) query.category = req.query.category;
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { title: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    if (req.query.priceRange) {
      const [min, max] = req.query.priceRange.split('-');
      query.price = { $gte: Number(min), $lte: Number(max) };
    }

    let result = Product.find(query).populate('artisanId', 'name email');

    if (req.query.sort === 'price-low') result = result.sort({ price: 1 });
    else if (req.query.sort === 'price-high') result = result.sort({ price: -1 });
    else result = result.sort({ createdAt: -1 });

    const products = await result;
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 🔹 GET SINGLE PRODUCT
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('artisanId', 'name');

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🔹 CREATE PRODUCT (UPDATED FOR NEW MODEL)
exports.createProduct = async (req, res) => {
  const {
    name,
    price,
    description,
    images,
    category,
    origin,
    tradition,
    culturalMeaning,
    regionTag,
    tags,
    stock
  } = req.body;

  try {
    const product = new Product({
      name,
      price,
      description,
      images, // ✅ now supports multiple images
      category,
      artisanId: req.user._id,
      artisanName: req.user.name,
      origin,
      tradition,
      culturalMeaning,
      regionTag,
      tags,
      stock: stock !== undefined ? stock : 10
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🔹 UPDATE PRODUCT
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      if (
        product.artisanId.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin'
      ) {
        return res.status(403).json({ message: 'Not authorized to update this product' });
      }

      Object.assign(product, req.body);

      const updatedProduct = await product.save();
      res.json(updatedProduct);

    } else {
      res.status(404).json({ message: 'Product not found' });
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🔹 DELETE PRODUCT
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      if (
        product.artisanId.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin'
      ) {
        return res.status(403).json({ message: 'Not authorized to delete this product' });
      }

      await product.deleteOne();
      res.json({ message: 'Product removed' });

    } else {
      res.status(404).json({ message: 'Product not found' });
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// 🔥 ADD REVIEW (NEW FEATURE)
exports.addReview = async (req, res) => {
  const { rating, comment } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      // ✅ Check if the user has a delivered order for this product
      const hasPurchased = await Order.findOne({
        userId: req.user._id,
        status: 'Delivered',
        'products.productId': product._id
      });

      if (!hasPurchased) {
        return res.status(403).json({ message: 'You can only review products after receiving them.' });
      }
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        return res.status(400).json({ message: 'Product already reviewed' });
      }

      const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
      };

      product.reviews.push(review);

      product.numReviews = product.reviews.length;

      product.averageRating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();

      res.status(201).json({ message: 'Review added' });

    } else {
      res.status(404).json({ message: 'Product not found' });
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};