const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.use(authenticateToken);

/**
 * The activity feed is the audit trail, and the dashboard surfaces it only to
 * staff. Route access must match that intent - otherwise any member could read
 * it by calling the endpoint directly, which is exactly the "hide the button,
 * forget the server" mistake this check prevents.
 */
router.get(
  '/',
  authorizeRoles('super_admin', 'admin', 'developer'),
  activityController.getWorkspaceActivity
);

module.exports = router;