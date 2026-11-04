const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getConversations,
  getThread,
  markAsRead,
} = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/conversations', getConversations);
router.get('/thread/:userId', getThread);
router.get('/:userId', getThread);
router.post('/', sendMessage);
router.put('/read/:userId', markAsRead);
router.put('/:userId/read', markAsRead);

module.exports = router;

