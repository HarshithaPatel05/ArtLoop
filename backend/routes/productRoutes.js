const express = require('express');

const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    addReview
} = require('../controllers/productController');

const { protect } = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorize');

const router = express.Router();


// 🔹 PUBLIC ROUTES
router.get('/', getProducts);
router.get('/:id', getProductById);


// 🔹 PRODUCT MANAGEMENT (Artisan/Admin)
router.post('/', protect, authorize('artisan', 'admin'), createProduct);
router.put('/:id', protect, authorize('artisan', 'admin'), updateProduct);
router.delete('/:id', protect, authorize('artisan', 'admin'), deleteProduct);


// 🔥 REVIEW ROUTE (NEW FEATURE)
router.post('/:id/reviews', protect, authorize('user', 'buyer', 'admin'), addReview);


module.exports = router;