const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const { avatarUpload } = require('../middleware/upload');

// Public Routes
router.post('/send-otp', authController.sendOtp);
router.post('/verify-otp', authController.verifyOtp);
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected Routes (JWT Token Required)
router.get('/me', authenticateToken, authController.getMe);

/**
 * Profile picture.
 * avatarUpload enforces images-only and a 2MB cap, and its fileFilter runs
 * before anything touches disk.
 */
router.post(
  '/avatar',
  authenticateToken,
  avatarUpload.single('avatar'),
  authController.uploadAvatar
);

router.delete('/avatar', authenticateToken, authController.deleteAvatar);

module.exports = router;
