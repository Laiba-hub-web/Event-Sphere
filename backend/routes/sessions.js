const express = require('express');
const router = express.Router();
const {
  getSessionsByExpo,
  getSession,
  createSession,
  updateSession,
  deleteSession,
  bookmarkSession,
  unbookmarkSession,
  getMyBookmarks,
} = require('../controllers/sessionController');
const { protect, authorize } = require('../middleware/auth');

router.get('/my-bookmarks', protect, getMyBookmarks);
router.get('/expo/:expoId', getSessionsByExpo);
router.get('/:id', getSession);

router.post('/', protect, authorize('admin'), createSession);
router.put('/:id', protect, authorize('admin'), updateSession);
router.delete('/:id', protect, authorize('admin'), deleteSession);

router.post('/:id/bookmark', protect, bookmarkSession);
router.delete('/:id/bookmark', protect, unbookmarkSession);
router.put('/:id/bookmark', protect, bookmarkSession);

module.exports = router;
