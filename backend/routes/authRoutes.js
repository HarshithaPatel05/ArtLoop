const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  getAllUsers,
  approveArtisan,
  deleteUser
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorize');

// PUBLIC ROUTES
router.post('/register', registerUser);
router.post('/login', loginUser);

// PRIVATE ROUTES
router.get('/me', protect, getUserProfile);

// ADMIN ROUTES
router.get('/users', protect, authorize('admin'), getAllUsers);
router.put('/users/:id/approve', protect, authorize('admin'), approveArtisan);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);

module.exports = router;