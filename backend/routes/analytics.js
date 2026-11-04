const express = require('express');
const router = express.Router();
const {
  getExpoAnalytics,
  getRegistrationsOverTime,
  getSessionPopularity,
  getBoothStats,
} = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));

router.get('/expo/:expoId', getExpoAnalytics);
router.get('/expo/:expoId/registrations', getRegistrationsOverTime);
router.get('/expo/:expoId/sessions', getSessionPopularity);
router.get('/expo/:expoId/booths', getBoothStats);

module.exports = router;

