const express = require('express');
const router = express.Router();
const {
  registerForExpo,
  cancelRegistration,
  getMyRegistrations,
  getExpoRegistrations,
  checkRegistration,
} = require('../controllers/registrationController');
const { protect, authorize } = require('../middleware/auth');

router.get('/my', protect, getMyRegistrations);
router.get('/check/:expoId', protect, checkRegistration);
router.get('/expo/:expoId', protect, authorize('admin'), getExpoRegistrations);

router.post('/expo/:expoId', protect, registerForExpo);
router.post('/', protect, registerForExpo);
router.delete('/expo/:expoId', protect, cancelRegistration);
router.put('/:id/cancel', protect, cancelRegistration);

module.exports = router;

