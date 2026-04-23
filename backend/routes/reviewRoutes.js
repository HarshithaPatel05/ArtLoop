const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Product = require('../models/Product');
const { protect } = require('../middleware/authMiddleware');

// Add Review
const addReview = async (req, res) => {
    try {
        console.log('[REVIEWS] POST /api/reviews');
        const { productId, rating, comment } = req.body;

        if (!productId || !rating || !comment) {
            return res.status(400).json({ message: 'productId, rating and comment are required' });
        }

        const existingReview = await Review.findOne({
            user: req.user._id,
            product: productId
        });

        if (existingReview) {
            return res.status(400).json({ message: 'You already reviewed this product' });
        }

        const review = new Review({
            user: req.user._id,
            product: productId,
            rating,
            comment
        });

        const savedReview = await review.save();

        const productReviews = await Review.find({ product: productId });
        const avgRating =
            productReviews.reduce((sum, item) => sum + item.rating, 0) / productReviews.length;

        await Product.findByIdAndUpdate(productId, {
            averageRating: Number(avgRating.toFixed(1)),
            numReviews: productReviews.length
        });

        res.status(201).json(savedReview);
    } catch (error) {
        console.error('Review Error:', error);
        res.status(500).json({ message: error.message });
    }
};

router.post('/', protect, addReview);

// Get Reviews
router.get('/:productId', async (req, res) => {
    try {
        console.log(`[REVIEWS] GET /api/reviews/${req.params.productId}`);
        const reviews = await Review.find({
            product: req.params.productId
        }).populate('user', 'name');

        res.json(reviews);
    } catch (error) {
        console.error('Fetch Reviews Error:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;