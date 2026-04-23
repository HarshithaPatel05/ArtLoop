const express = require('express');
const router = express.Router();

const cartController = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

// IMPORTANT: use correct references
router.get('/', protect, cartController.getCart);
router.post('/add', protect, cartController.addToCart);
router.put('/:id', protect, cartController.updateCartItem);
router.delete('/clear', protect, cartController.clearCart);
router.delete('/:id', protect, cartController.removeFromCart);

module.exports = router;