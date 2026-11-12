const { validationResult } = require('express-validator');
const Expo = require('../models/Expo');
const Booth = require('../models/Booth');
const Session = require('../models/Session');
const Registration = require('../models/Registration');

// ─── Helper: build an array of Booth documents for auto-creation ──────────────
const buildBooths = (expoId, rows, columns) => {
  const booths = [];
  for (let r = 1; r <= rows; r++) {
    for (let c = 1; c <= columns; c++) {
      booths.push({
        expo: expoId,
        // e.g., "A-1", "A-2", "B-1" …
        number: `${String.fromCharCode(64 + r)}-${c}`,
        row: r,
        column: c,
      });
    }
  }
  return booths;
};

// ─── @route   GET /api/expos ──────────────────────────────────────────────────
// ─── @access  Public (admin sees all, everyone else sees published/ongoing)
const getExpos = async (req, res, next) => {
  try {
    const filter =
      req.user && req.user.role === 'admin'
        ? {}
        : { status: { $in: ['published', 'ongoing'] } };

    const expos = await Expo.find(filter)
      .populate('organizer', 'name email')
      .sort({ createdAt: 1 });

    res.status(200).json({ success: true, count: expos.length, expos });
  } catch (err) {
    next(err);
  }
};

// ─── @route   GET /api/expos/:id ─────────────────────────────────────────────
// ─── @access  Public
const getExpo = async (req, res, next) => {
  try {
    const expo = await Expo.findById(req.params.id).populate(
      'organizer',
      'name email'
    );

    if (!expo) {
      return res
        .status(404)
        .json({ success: false, message: 'Expo not found' });
    }

    // Fetch associated sessions and exhibitor profiles for context
    const sessions = await Session.find({ expo: expo._id }).select(
      'title speaker startTime endTime status capacity'
    );

    res.status(200).json({ success: true, expo, sessions });
  } catch (err) {
    next(err);
  }
};

// ─── @route   POST /api/expos ─────────────────────────────────────────────────
// ─── @access  Private / Admin
const createExpo = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const {
      title,
      description,
      date,
      endDate,
      location,
      theme,
      status,
      tags,
      boothRows,
      boothColumns,
    } = req.body;

    // Handle optional banner image upload
    let bannerImage = req.body.bannerImage || '';
    if (req.file) {
      bannerImage = `/uploads/${req.file.filename}`;
    }

    const expo = await Expo.create({
      title,
      description,
      date,
      endDate,
      location,
      theme,
      status,
      bannerImage,
      organizer: req.user._id,
      boothRows: boothRows || 5,
      boothColumns: boothColumns || 10,
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map((t) => t.trim())) : [],
    });

    // Auto-generate booth grid
    const boothDocs = buildBooths(expo._id, expo.boothRows, expo.boothColumns);
    if (boothDocs.length > 0) {
      await Booth.insertMany(boothDocs);
    }

    res.status(201).json({
      success: true,
      message: `Expo created with ${boothDocs.length} booths`,
      expo,
    });
  } catch (err) {
    next(err);
  }
};

// ─── @route   PUT /api/expos/:id ─────────────────────────────────────────────
// ─── @access  Private / Admin
const updateExpo = async (req, res, next) => {
  try {
    let expo = await Expo.findById(req.params.id);

    if (!expo) {
      return res
        .status(404)
        .json({ success: false, message: 'Expo not found' });
    }

    // Handle optional banner image upload
    if (req.file) {
      req.body.bannerImage = `/uploads/${req.file.filename}`;
    }

    // Handle tags if passed as comma-separated string
    if (req.body.tags && !Array.isArray(req.body.tags)) {
      req.body.tags = req.body.tags.split(',').map((t) => t.trim());
    }

    expo = await Expo.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('organizer', 'name email');

    res.status(200).json({ success: true, expo });
  } catch (err) {
    next(err);
  }
};

// ─── @route   DELETE /api/expos/:id ──────────────────────────────────────────
// ─── @access  Private / Admin
const deleteExpo = async (req, res, next) => {
  try {
    const expo = await Expo.findById(req.params.id);

    if (!expo) {
      return res
        .status(404)
        .json({ success: false, message: 'Expo not found' });
    }

    // Cascade-delete related documents
    await Promise.all([
      Booth.deleteMany({ expo: expo._id }),
      Session.deleteMany({ expo: expo._id }),
      Registration.deleteMany({ expo: expo._id }),
    ]);

    await expo.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Expo and all related data deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};

// ─── @route   GET /api/expos/my ──────────────────────────────────────────────
// ─── @access  Private / Admin
const getMyExpos = async (req, res, next) => {
  try {
    const expos = await Expo.find({ organizer: req.user._id }).sort({
      createdAt: 1,
    });

    res.status(200).json({ success: true, count: expos.length, expos });
  } catch (err) {
    next(err);
  }
};

// ─── @route   GET /api/expos/:id/stats ───────────────────────────────────────
// ─── @access  Private / Admin
const getExpoStats = async (req, res, next) => {
  try {
    const expoId = req.params.id;
    const [totalBooths, occupiedBooths, reservedBooths, totalSessions, totalRegistrations] =
      await Promise.all([
        Booth.countDocuments({ expo: expoId }),
        Booth.countDocuments({ expo: expoId, status: 'occupied' }),
        Booth.countDocuments({ expo: expoId, status: 'reserved' }),
        Session.countDocuments({ expo: expoId }),
        Registration.countDocuments({ expo: expoId }),
      ]);

    res.status(200).json({
      success: true,
      stats: {
        totalBooths,
        occupiedBooths,
        reservedBooths,
        availableBooths: totalBooths - (occupiedBooths + reservedBooths),
        totalSessions,
        totalRegistrations,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getExpos,
  getExpo,
  createExpo,
  updateExpo,
  deleteExpo,
  getMyExpos,
  getExpoStats,
};
