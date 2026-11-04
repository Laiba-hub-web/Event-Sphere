const express = require('express');
const router = express.Router();
const {
  submitFeedback,
  getByExpo,
  getBySession,
  getMyFeedback,
} = require('../controllers/feedbackController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, submitFeedback);
router.get('/my', protect, getMyFeedback);
router.get('/expo/:expoId', protect, authorize('admin'), getByExpo);
router.get('/session/:sessionId', protect, getBySession);

module.exports = router;

