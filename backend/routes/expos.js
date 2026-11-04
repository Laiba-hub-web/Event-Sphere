const express = require('express');
const router = express.Router();
const {
  getExpos,
  getExpo,
  createExpo,
  updateExpo,
  deleteExpo,
  getMyExpos,
  getExpoStats,
} = require('../controllers/expoController');
const { protect, authorize } = require('../middleware/auth');
const { uploadSingle } = require('../middleware/upload');

// Optional auth on getExpos so admin sees all, others see published
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return protect(req, res, next);
  }
  next();
};

router.get('/', optionalAuth, getExpos);
router.get('/my', protect, authorize('admin'), getMyExpos);
router.get('/:id/stats', protect, authorize('admin'), getExpoStats);
router.get('/:id', optionalAuth, getExpo);
router.post('/', protect, authorize('admin'), uploadSingle('bannerImage'), createExpo);
router.put('/:id', protect, authorize('admin'), uploadSingle('bannerImage'), updateExpo);
router.delete('/:id', protect, authorize('admin'), deleteExpo);

module.exports = router;
