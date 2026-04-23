const express = require('express');
const { addOrderItems, getOrderById, getMyOrders, getOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorize');
const router = express.Router();

router.post('/', protect, addOrderItems);
router.get('/myorders', protect, getMyOrders);
router.get('/check-purchase/:productId', protect, require('../controllers/orderController').checkPurchase);
router.get('/:id', protect, getOrderById);
router.get('/', protect, authorize('admin'), getOrders);
router.put('/:id/status', protect, authorize('admin', 'artisan'), updateOrderStatus);

module.exports = router;
