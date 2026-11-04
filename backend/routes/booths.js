const express = require('express');
const router = express.Router();
const {
  getBoothsByExpo,
  getBooth,
  updateBooth,
  assignBooth,
  reserveBooth,
  releaseBooth,
} = require('../controllers/boothController');
const { protect, authorize } = require('../middleware/auth');

router.get('/expo/:expoId', getBoothsByExpo);
router.get('/:id', getBooth);
router.put('/:id', protect, authorize('admin'), updateBooth);

// Assign (Admin only)
router.post('/:id/assign', protect, authorize('admin'), assignBooth);
router.put('/:id/assign', protect, authorize('admin'), assignBooth);

// Reserve (Exhibitor or Admin)
router.post('/:id/reserve', protect, authorize('exhibitor', 'admin'), reserveBooth);
router.put('/:id/reserve', protect, authorize('exhibitor', 'admin'), reserveBooth);

// Release (Exhibitor or Admin)
router.post('/:id/release', protect, releaseBooth);
router.put('/:id/release', protect, releaseBooth);

module.exports = router;
