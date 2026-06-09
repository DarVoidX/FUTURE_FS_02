const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const Admin = require('../models/Admin');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// @route   POST /api/auth/login
// @desc    Login admin
// @access  Public
router.post(
  '/login',
  [
    body('username').trim().notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    try {
      const { username, password } = req.body;
      const admin = await Admin.findOne({ username: username.toLowerCase() });

      if (!admin || !(await admin.matchPassword(password))) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      if (!admin.isActive) {
        return res.status(401).json({ message: 'Account is deactivated. Contact support.' });
      }

      res.json({
        success: true,
        token: generateToken(admin._id),
        user: admin.toJSON(),
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error during login' });
    }
  }
);

// @route   GET /api/auth/me
// @desc    Get current logged in admin
// @access  Private
router.get('/me', protect, async (req, res) => {
  res.json({ success: true, user: req.user });
});

// @route   PUT /api/auth/profile
// @desc    Update admin profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const { fullName, email, company, timezone } = req.body;
    const admin = await Admin.findById(req.user._id);

    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    if (fullName) admin.fullName = fullName;
    if (email) admin.email = email;
    if (company) admin.company = company;
    if (timezone) admin.timezone = timezone;

    await admin.save();
    res.json({ success: true, user: admin.toJSON(), message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/auth/change-password
// @desc    Change admin password
// @access  Private
router.put(
  '/change-password',
  protect,
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 6 })
      .withMessage('New password must be at least 6 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    try {
      const { currentPassword, newPassword } = req.body;
      const admin = await Admin.findById(req.user._id);

      if (!(await admin.matchPassword(currentPassword))) {
        return res.status(401).json({ message: 'Current password is incorrect' });
      }

      admin.password = newPassword;
      await admin.save();

      res.json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
      console.error('Password change error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = router;
