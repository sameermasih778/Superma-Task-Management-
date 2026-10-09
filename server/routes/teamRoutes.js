const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/', teamController.getTeams);
// Registered before the /:id routes so "mine" is not read as a team id.
router.get('/mine', teamController.getMyTeams);
router.post('/', teamController.createTeam);
router.get('/:id/members', teamController.getTeamMembers);
router.post('/:id/members', teamController.addTeamMember);
router.delete('/:id/members/:userId', teamController.removeTeamMember);
router.delete('/:id', teamController.deleteTeam);

module.exports = router;
