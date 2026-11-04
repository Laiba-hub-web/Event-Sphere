const express = require('express');
const router = express.Router();
const {
  applyToExpo,
  getApplications,
  getMyApplications,
  updateApplication,
  approveApplication,
  rejectApplication,
  updateProfile,
  getMyProfile,
  getExhibitorsByExpo,
  getExhibitorProfile,
} = require('../controllers/exhibitorController');
const { protect, authorize } = require('../middleware/auth');
const { uploadSingle } = require('../middleware/upload');

// Profile routes
router.get('/profile', protect, getMyProfile);
router.put('/profile', protect, uploadSingle('logo'), updateProfile);

// Applications
router.get('/my-applications', protect, authorize('exhibitor'), getMyApplications);
router.get('/my', protect, authorize('exhibitor'), getMyApplications);

router.post('/apply', protect, authorize('exhibitor'), uploadSingle('logo'), applyToExpo);
router.post('/apply/:expoId', protect, authorize('exhibitor'), uploadSingle('logo'), applyToExpo);

// Expo exhibitors and applications
router.get('/expo/:expoId/applications', protect, authorize('admin'), getApplications);
router.get('/expo/:expoId', getExhibitorsByExpo);

// Application actions (Admin)
router.put('/application/:id', protect, authorize('admin'), updateApplication);
router.put('/:id/approve', protect, authorize('admin'), approveApplication);
router.put('/:id/reject', protect, authorize('admin'), rejectApplication);

// Single exhibitor profile
router.get('/:id', getExhibitorProfile);

module.exports = router;

