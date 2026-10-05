const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

// Public Routes
router.post('/send-otp', authController.sendOtp);
router.post('/verify-otp', authController.verifyOtp);
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected Routes (JWT Token Required)
router.get('/me', authenticateToken, authController.getMe);

module.exports = router;
