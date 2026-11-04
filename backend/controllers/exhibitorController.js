const { validationResult } = require('express-validator');
const ExhibitorProfile = require('../models/ExhibitorProfile');
const Expo = require('../models/Expo');

// ─── @route   POST /api/exhibitors/apply ─────────────────────────────────────
// ─── @access  Private / Exhibitor
const applyToExpo = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const expoId = req.params.expoId || req.body.expoId;
    const {
      company,
      description,
      products,
      services,
      website,
      contactEmail,
      contactPhone,
    } = req.body;

    // Verify expo exists
    const expo = await Expo.findById(expoId);
    if (!expo) {
      return res
        .status(404)
        .json({ success: false, message: 'Expo not found' });
    }

    // Check for duplicate application
    const existing = await ExhibitorProfile.findOne({
      user: req.user._id,
      expo: expoId,
    });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied to this expo',
      });
    }

    // Handle optional logo upload
    let logo = '';
    if (req.file) {
      logo = `/uploads/${req.file.filename}`;
    }

    const profile = await ExhibitorProfile.create({
      user: req.user._id,
      expo: expoId,
      company,
      description,
      products: products
        ? Array.isArray(products)
          ? products
          : products.split(',').map((p) => p.trim())
        : [],
      services: services
        ? Array.isArray(services)
          ? services
          : services.split(',').map((s) => s.trim())
        : [],
      logo,
      website,
      contactEmail,
      contactPhone,
    });

    res.status(201).json({ success: true, profile });
  } catch (err) {
    next(err);
  }
};

// ─── @route   GET /api/exhibitors/expo/:expoId/applications ──────────────────
// ─── @access  Private / Admin
const getApplications = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = { expo: req.params.expoId };
    if (status) filter.applicationStatus = status;

    const applications = await ExhibitorProfile.find(filter)
      .populate('user', 'name email avatar')
      .populate('expo', 'title date')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (err) {
    next(err);
  }
};

// ─── @route   GET /api/exhibitors/my ─────────────────────────────────────────
// ─── @access  Private / Exhibitor
const getMyApplications = async (req, res, next) => {
  try {
    const applications = await ExhibitorProfile.find({ user: req.user._id })
      .populate('expo', 'title date location status')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (err) {
    next(err);
  }
};

// ─── @route   PUT /api/exhibitors/application/:id ─────────────────────────────
// ─── @access  Private / Admin — approve or reject
const updateApplication = async (req, res, next) => {
  try {
    const { applicationStatus, rejectionReason } = req.body;

    const allowedStatuses = ['pending', 'approved', 'rejected'];
    if (!allowedStatuses.includes(applicationStatus)) {
      return res.status(400).json({
        success: false,
        message: `applicationStatus must be one of: ${allowedStatuses.join(', ')}`,
      });
    }

    const updateData = { applicationStatus };
    if (applicationStatus === 'rejected' && rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    } else if (applicationStatus === 'approved') {
      updateData.rejectionReason = ''; // Clear any previous rejection reason
    }

    const profile = await ExhibitorProfile.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    )
      .populate('user', 'name email')
      .populate('expo', 'title');

    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: 'Application not found' });
    }

    res.status(200).json({ success: true, profile });
  } catch (err) {
    next(err);
  }
};

// ─── @route   PUT /api/exhibitors/profile ────────────────────────────────────
// ─── @access  Private / Exhibitor
const updateProfile = async (req, res, next) => {
  try {
    const {
      company,
      description,
      products,
      services,
      website,
      contactEmail,
      contactPhone,
      expoId,
    } = req.body;

    // Find the exhibitor's profile (optionally filtered by expo)
    const filter = { user: req.user._id };
    if (expoId) filter.expo = expoId;

    const updateData = {};
    if (company) updateData.company = company;
    if (description !== undefined) updateData.description = description;
    if (website !== undefined) updateData.website = website;
    if (contactEmail !== undefined) updateData.contactEmail = contactEmail;
    if (contactPhone !== undefined) updateData.contactPhone = contactPhone;
    if (products) {
      updateData.products = Array.isArray(products)
        ? products
        : products.split(',').map((p) => p.trim());
    }
    if (services) {
      updateData.services = Array.isArray(services)
        ? services
        : services.split(',').map((s) => s.trim());
    }
    if (req.file) {
      updateData.logo = `/uploads/${req.file.filename}`;
    }

    const profile = await ExhibitorProfile.findOneAndUpdate(
      filter,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: 'Exhibitor profile not found' });
    }

    res.status(200).json({ success: true, profile });
  } catch (err) {
    next(err);
  }
};

// ─── @route   GET /api/exhibitors/expo/:expoId ───────────────────────────────
// ─── @access  Private
const getExhibitorsByExpo = async (req, res, next) => {
  try {
    const exhibitors = await ExhibitorProfile.find({
      expo: req.params.expoId,
      applicationStatus: 'approved',
    })
      .populate('user', 'name email avatar')
      .sort({ company: 1 });

    res.status(200).json({
      success: true,
      count: exhibitors.length,
      exhibitors,
    });
  } catch (err) {
    next(err);
  }
};

// ─── @route   GET /api/exhibitors/:id ────────────────────────────────────────
// ─── @access  Private
const getExhibitorProfile = async (req, res, next) => {
  try {
    const profile = await ExhibitorProfile.findById(req.params.id)
      .populate('user', 'name email avatar')
      .populate('expo', 'title date location');

    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: 'Exhibitor profile not found' });
    }

    res.status(200).json({ success: true, profile });
  } catch (err) {
    next(err);
  }
};

// ─── @route   GET /api/exhibitors/profile ────────────────────────────────────
// ─── @access  Private / Exhibitor
const getMyProfile = async (req, res, next) => {
  try {
    const profile = await ExhibitorProfile.findOne({ user: req.user._id })
      .populate('user', 'name email avatar')
      .populate('expo', 'title date location');

    res.status(200).json({ success: true, profile });
  } catch (err) {
    next(err);
  }
};

// ─── @route   PUT /api/exhibitors/:id/approve ─────────────────────────────────
// ─── @access  Private / Admin
const approveApplication = async (req, res, next) => {
  try {
    const profile = await ExhibitorProfile.findByIdAndUpdate(
      req.params.id,
      { $set: { applicationStatus: 'approved', rejectionReason: '' } },
      { new: true, runValidators: true }
    )
      .populate('user', 'name email')
      .populate('expo', 'title');

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    res.status(200).json({ success: true, profile });
  } catch (err) {
    next(err);
  }
};

// ─── @route   PUT /api/exhibitors/:id/reject ──────────────────────────────────
// ─── @access  Private / Admin
const rejectApplication = async (req, res, next) => {
  try {
    const { rejectionReason } = req.body;
    const profile = await ExhibitorProfile.findByIdAndUpdate(
      req.params.id,
      { $set: { applicationStatus: 'rejected', rejectionReason: rejectionReason || 'Application rejected by organizer' } },
      { new: true, runValidators: true }
    )
      .populate('user', 'name email')
      .populate('expo', 'title');

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    res.status(200).json({ success: true, profile });
  } catch (err) {
    next(err);
  }
};

module.exports = {
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
};
