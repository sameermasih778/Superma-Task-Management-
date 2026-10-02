const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/', commentController.getTaskComments);
router.post('/', commentController.addComment);
router.delete('/:id', commentController.deleteComment);

module.exports = router;
