const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// All admin routes require authentication
router.use(authenticateToken);

// --- User Management (Admin, Developer & Super Admin) ---
router.get(
  '/users',
  authorizeRoles('super_admin', 'admin', 'developer'),
  adminController.getAllUsers
);

router.patch(
  '/users/:id/role',
  authorizeRoles('super_admin', 'admin', 'developer'),
  adminController.updateUserRole
);

router.patch(
  '/users/:id/reset-password',
  authorizeRoles('super_admin', 'admin', 'developer'),
  adminController.resetUserPassword
);

// Suspend / Re-activate a user account
router.patch(
  '/users/:id/status',
  authorizeRoles('super_admin', 'admin', 'developer'),
  adminController.updateUserStatus
);

// Delete user - Super Admin only (destructive, irreversible)
router.delete(
  '/users/:id',
  authorizeRoles('super_admin'),
  adminController.deleteUser
);

// --- Broadcast Notifications (Admin, Developer & Super Admin) ---
router.post(
  '/notifications/broadcast',
  authorizeRoles('super_admin', 'admin', 'developer'),
  adminController.broadcastNotification
);

module.exports = router;
