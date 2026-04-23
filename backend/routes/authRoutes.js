const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ msg: 'Please provide name, email and password' });
    }

    // Check user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Validate role
    const validRoles = ['customer', 'artisan', 'admin'];
    const userRole = validRoles.includes(role) ? role : 'customer';

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user with hashed password directly (no pre-save hook)
    user = await User.create({ name, email, password: hashedPassword, role: userRole });

    // Create token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, _id: user._id, name: user.name, email: user.email, role: user.role });

  } catch (err) {
    console.error('[REGISTER ERROR]', err.message, err.stack);
    res.status(500).json({ msg: 'Server error', detail: err.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: 'Please provide email and password' });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, _id: user._id, name: user.name, email: user.email, role: user.role });

  } catch (err) {
    console.error('[LOGIN ERROR]', err.message, err.stack);
    res.status(500).json({ msg: 'Server error', detail: err.message });
  }
});

// GET CURRENT USER
router.get('/me', async (req, res) => {
  try {
    const token = req.header('x-auth-token');

    if (!token) return res.status(401).json({ msg: 'No token' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    res.json(user);

  } catch (err) {
    res.status(401).json({ msg: 'Token invalid' });
  }
});

module.exports = router;