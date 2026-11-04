const Registration = require('../models/Registration');
const Expo = require('../models/Expo');
const generateQRCode = require('../utils/generateQR');

// ─── @route   POST /api/registrations/expo/:expoId ───────────────────────────
// ─── @access  Private / Attendee
const registerForExpo = async (req, res, next) => {
  try {
    const expoId = req.params.expoId || req.body.expoId || req.body.expo;
    if (!expoId) {
      return res.status(400).json({ success: false, message: 'Expo ID is required' });
    }

    const expo = await Expo.findById(expoId);
    if (!expo) {
      return res.status(404).json({ success: false, message: 'Expo not found' });
    }

    // Check if already registered
    const existing = await Registration.findOne({
      user: req.user._id,
      expo: expoId,
    });

    if (existing) {
      if (existing.status === 'cancelled') {
        existing.status = 'confirmed';
        existing.registeredAt = new Date();
        await existing.save();
        return res.status(200).json({ success: true, registration: existing });
      }
      return res.status(400).json({
        success: false,
        message: 'You are already registered for this expo',
      });
    }

    const registration = await Registration.create({
      user: req.user._id,
      expo: expoId,
      qrCode: generateQRCode(),
      status: 'confirmed',
    });

    res.status(201).json({ success: true, registration });
  } catch (err) {
    next(err);
  }
};

// ─── @route   DELETE /api/registrations/expo/:expoId ─────────────────────────
// ─── @access  Private / Attendee
const cancelRegistration = async (req, res, next) => {
  try {
    const expoId = req.params.expoId;
    const registration = await Registration.findOneAndUpdate(
      { user: req.user._id, expo: expoId },
      { $set: { status: 'cancelled' } },
      { new: true }
    );

    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }

    res.status(200).json({ success: true, message: 'Registration cancelled', registration });
  } catch (err) {
    next(err);
  }
};

// ─── @route   GET /api/registrations/my ──────────────────────────────────────
// ─── @access  Private
const getMyRegistrations = async (req, res, next) => {
  try {
    const registrations = await Registration.find({ user: req.user._id })
      .populate('expo', 'title date endDate location theme bannerImage status')
      .populate('sessions', 'title speaker startTime endTime location')
      .sort({ registeredAt: -1 });

    res.status(200).json({
      success: true,
      count: registrations.length,
      registrations,
    });
  } catch (err) {
    next(err);
  }
};

// ─── @route   GET /api/registrations/expo/:expoId ────────────────────────────
// ─── @access  Private / Admin
const getExpoRegistrations = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = { expo: req.params.expoId };
    if (status) filter.status = status;

    const registrations = await Registration.find(filter)
      .populate('user', 'name email avatar')
      .sort({ registeredAt: -1 });

    res.status(200).json({
      success: true,
      count: registrations.length,
      registrations,
    });
  } catch (err) {
    next(err);
  }
};

// ─── @route   GET /api/registrations/check/:expoId ───────────────────────────
// ─── @access  Private
const checkRegistration = async (req, res, next) => {
  try {
    const registration = await Registration.findOne({
      user: req.user._id,
      expo: req.params.expoId,
      status: 'confirmed',
    });

    res.status(200).json({
      success: true,
      isRegistered: !!registration,
      registration,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  registerForExpo,
  cancelRegistration,
  getMyRegistrations,
  getExpoRegistrations,
  checkRegistration,
};

