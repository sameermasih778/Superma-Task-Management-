const express = require('express');
const router = express.Router();
const workspaceController = require('../controllers/workspaceController');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken); // All workspace endpoints require JWT auth

router.get('/', workspaceController.getUserWorkspaces);
router.post('/', workspaceController.createWorkspace);
router.get('/:id/members', workspaceController.getWorkspaceMembers);
router.post('/:id/members', workspaceController.addWorkspaceMember);

module.exports = router;
