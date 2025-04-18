const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const { registerValidation, loginValidation } = require('../middleware/validation');

// @route   POST /api/auth/register
// @desc    Register a user
// @access  Public
// Register
router.post('/register', registerValidation, authController.register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
// Login
router.post('/login', loginValidation, authController.login);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
// Get current user
router.get('/me', auth, authController.getCurrentUser);

module.exports = router;
