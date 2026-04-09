const { Router } = require('express');
const {
  getAllDiscussions,
  getDiscussionById,
  createDiscussion,
  createReply,
  likeDiscussion,
} = require('../controllers/discussionController');
const { authenticate } = require('../middleware/auth');

const router = Router();

router.get('/', authenticate, getAllDiscussions);
router.get('/:id', authenticate, getDiscussionById);
router.post('/', authenticate, createDiscussion);
router.post('/:id/replies', authenticate, createReply);
router.post('/:id/like', authenticate, likeDiscussion);

module.exports = router;
