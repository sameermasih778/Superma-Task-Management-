const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const leadsController = require('../controllers/leadsController');
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

// --- Lead Inbox (Admin, Developer & Super Admin) ---
// Marketing leads captured by the public site. Staff could not read these at
// all before, even though the contact form and waitlist had been saving rows.
router.get(
  '/leads/contact',
  authorizeRoles('super_admin', 'admin', 'developer'),
  leadsController.getContactMessages
);

router.patch(
  '/leads/contact/:id/status',
  authorizeRoles('super_admin', 'admin', 'developer'),
  leadsController.updateContactStatus
);

router.get(
  '/leads/waitlist',
  authorizeRoles('super_admin', 'admin', 'developer'),
  leadsController.getWaitlistLeads
);

router.patch(
  '/leads/waitlist/:id/status',
  authorizeRoles('super_admin', 'admin', 'developer'),
  leadsController.updateWaitlistStatus
);

router.get(
  '/leads/export',
  authorizeRoles('super_admin', 'admin', 'developer'),
  leadsController.exportLeadsCsv
);

// --- Broadcast Notifications (Admin, Developer & Super Admin) ---
router.post(
  '/notifications/broadcast',
  authorizeRoles('super_admin', 'admin', 'developer'),
  adminController.broadcastNotification
);

module.exports = router;
