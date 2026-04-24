const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Product = require('../models/Product');
const { protect } = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorize');


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

// Get All Reviews (Admin)
router.get('/', protect, authorize('admin'), async (req, res) => {
    try {
        const reviews = await Review.find({}).populate('user', 'name email').populate('product', 'name');
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete Review (Admin/Owner)
router.delete('/:id', protect, async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) return res.status(404).json({ message: 'Review not found' });

        // Only admin or the person who wrote the review can delete it
        if (req.user.role !== 'admin' && review.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await review.deleteOne();
        res.json({ message: 'Review removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;