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
    const Booth = require('../models/Booth');
    const { status } = req.query;
    const filter = { expo: req.params.expoId };
    if (status) filter.applicationStatus = status;

    const [applications, booths] = await Promise.all([
      ExhibitorProfile.find(filter)
        .populate('user', 'name email avatar')
        .populate('expo', 'title date')
        .sort({ createdAt: 1 })
        .lean(),
      Booth.find({ expo: req.params.expoId, status: { $ne: 'available' } })
        .select('number size status price exhibitor exhibitorProfile')
        .lean(),
    ]);

    const enriched = applications.map((app) => {
      const matchedBooth = booths.find(
        (b) =>
          (b.exhibitorProfile && b.exhibitorProfile.toString() === app._id.toString()) ||
          (b.exhibitor && app.user?._id && b.exhibitor.toString() === app.user._id.toString())
      );
      return {
        ...app,
        booth: matchedBooth || null,
      };
    });

    res.status(200).json({
      success: true,
      count: enriched.length,
      applications: enriched,
    });
  } catch (err) {
    next(err);
  }
};

// ─── @route   GET /api/exhibitors/my ─────────────────────────────────────────
// ─── @access  Private / Exhibitor
const getMyApplications = async (req, res, next) => {
  try {
    const Booth = require('../models/Booth');
    const [applications, userBooths] = await Promise.all([
      ExhibitorProfile.find({ user: req.user._id })
        .populate('expo', 'title date location status')
        .sort({ createdAt: 1 })
        .lean(),
      Booth.find({ exhibitor: req.user._id })
        .populate('expo', 'title date location status')
        .select('number size status price expo exhibitorProfile')
        .lean(),
    ]);

    const enriched = applications.map((app) => {
      const appExpoId = app.expo?._id?.toString() || app.expo?.toString();
      const matchedBooth = userBooths.find((b) => {
        const bExpoId = b.expo?._id?.toString() || b.expo?.toString();
        return (
          (b.exhibitorProfile && b.exhibitorProfile.toString() === app._id.toString()) ||
          (bExpoId && appExpoId && bExpoId === appExpoId)
        );
      });
      return {
        ...app,
        booth: matchedBooth || null,
      };
    });

    // If user was assigned a booth in an expo where they didn't have an application record yet, include it
    const seenExpoIds = new Set(
      enriched.map((a) => a.expo?._id?.toString()).filter(Boolean)
    );
    for (const b of userBooths) {
      const bExpoId = b.expo?._id?.toString();
      if (bExpoId && !seenExpoIds.has(bExpoId)) {
        seenExpoIds.add(bExpoId);
        enriched.push({
          _id: b._id,
          user: req.user._id,
          expo: b.expo,
          company: `${req.user.name} Company`,
          products: ['Enterprise Solutions'],
          services: ['Partner Services'],
          applicationStatus: 'approved',
          booth: b,
        });
      }
    }

    res.status(200).json({
      success: true,
      count: enriched.length,
      applications: enriched,
    });
  } catch (err) {
    next(err);
  }
};

// ─── @route   PUT /api/exhibitors/application/:id ─────────────────────────────
// ─── @access  Private / Admin — approve, reject, or set pending
const updateApplication = async (req, res, next) => {
  try {
    const { applicationStatus, rejectionReason, expoId } = req.body;

    const allowedStatuses = ['pending', 'approved', 'rejected'];
    if (!allowedStatuses.includes(applicationStatus)) {
      return res.status(400).json({
        success: false,
        message: `applicationStatus must be one of: ${allowedStatuses.join(', ')}`,
      });
    }

    const resolved = await resolveOrCreateProfile(req.params.id, expoId);
    if (!resolved) {
      return res
        .status(404)
        .json({ success: false, message: 'Application not found' });
    }

    const updateData = { applicationStatus };
    if (applicationStatus === 'rejected' && rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    } else if (applicationStatus === 'approved' || applicationStatus === 'pending') {
      updateData.rejectionReason = '';
    }

    const profile = await ExhibitorProfile.findByIdAndUpdate(
      resolved._id,
      { $set: updateData },
      { new: true, runValidators: true }
    )
      .populate('user', 'name email')
      .populate('expo', 'title');

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
// ─── @access  Public / Private
const getExhibitorsByExpo = async (req, res, next) => {
  try {
    const User = require('../models/User');
    const Booth = require('../models/Booth');
    const filter = { expo: req.params.expoId };
    if (req.query.includeAll !== 'true' && req.query.all !== 'true') {
      filter.applicationStatus = 'approved';
    }

    const [initialExhibitors, expoBooths] = await Promise.all([
      ExhibitorProfile.find(filter)
        .populate('user', 'name email avatar createdAt')
        .sort({ createdAt: 1, company: 1 })
        .lean(),
      Booth.find({ expo: req.params.expoId, status: { $ne: 'available' } })
        .select('number size status price notes exhibitor exhibitorProfile')
        .lean(),
    ]);

    let exhibitors = initialExhibitors;

    // Always include all platform exhibitor companies when requested (?all=true / ?includeAll=true) or if this expo has none yet
    if (
      req.query.all === 'true' ||
      req.query.includeAll === 'true' ||
      exhibitors.length === 0
    ) {
      const [allProfiles, exhibitorUsers] = await Promise.all([
        ExhibitorProfile.find({})
          .populate('user', 'name email avatar createdAt')
          .sort({ company: 1 })
          .lean(),
        User.find({ role: 'exhibitor' }).select('name email avatar createdAt').lean(),
      ]);

      const defaultExhUser = exhibitorUsers[0] || null;

      // Ensure existing list items have a valid user reference
      exhibitors = exhibitors.map((item) => {
        if (!item.user && defaultExhUser) {
          return { ...item, user: defaultExhUser };
        }
        return item;
      });

      const seenKeys = new Set(
        exhibitors
          .map((e) => e.user?._id?.toString() || e.company)
          .filter(Boolean)
      );

      for (const prof of allProfiles) {
        const resolvedUser = prof.user || defaultExhUser;
        const key = resolvedUser?._id?.toString() || prof.company;
        if (key && !seenKeys.has(key)) {
          seenKeys.add(key);
          exhibitors.push({
            ...prof,
            user: resolvedUser,
          });
        }
      }

      for (const u of exhibitorUsers) {
        const uid = u._id.toString();
        if (!seenKeys.has(uid)) {
          seenKeys.add(uid);
          exhibitors.push({
            _id: u._id,
            company: u.name.includes('(')
              ? u.name.split('(')[1].replace(')', '').trim() + ' Solutions'
              : `${u.name} Enterprises`,
            description: 'Registered Exhibitor Partner',
            products: ['Enterprise Solutions'],
            services: ['Partner Consulting'],
            contactEmail: u.email,
            applicationStatus: 'pending',
            user: u,
          });
        }
      }
    }

    // Attach assigned booth for this expo to each exhibitor entry
    exhibitors = exhibitors.map((exh) => {
      const exhUserId = exh.user?._id?.toString();
      const exhProfileId = exh._id?.toString();
      const matchedBooth = expoBooths.find(
        (b) =>
          (b.exhibitorProfile && b.exhibitorProfile.toString() === exhProfileId) ||
          (b.exhibitor && exhUserId && b.exhibitor.toString() === exhUserId)
      );
      return {
        ...exh,
        booth: matchedBooth || null,
      };
    });

    res.status(200).json({
      success: true,
      count: exhibitors.length,
      exhibitors,
      applications: exhibitors,
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

// Helper to resolve or auto-create an ExhibitorProfile when Admin approves/rejects a registered exhibitor user
const resolveOrCreateProfile = async (idOrUserId, expoId) => {
  let profile = await ExhibitorProfile.findById(idOrUserId);
  if (profile) return profile;

  const User = require('../models/User');
  const exhUser = await User.findById(idOrUserId).lean();
  if (!exhUser) return null;

  const existingForUser = await ExhibitorProfile.findOne({ user: exhUser._id });
  if (existingForUser && (!expoId || existingForUser.expo?.toString() === expoId.toString())) {
    return existingForUser;
  }

  let targetExpoId = expoId || existingForUser?.expo;
  if (!targetExpoId) {
    const firstExpo = await Expo.findOne().sort({ createdAt: 1 }).lean();
    targetExpoId = firstExpo?._id;
  }

  profile = await ExhibitorProfile.create({
    user: exhUser._id,
    expo: targetExpoId,
    company: exhUser.name.includes('(')
      ? exhUser.name.split('(')[1].replace(')', '').trim() + ' Solutions'
      : `${exhUser.name} Enterprises`,
    description: 'Registered Exhibitor Partner showcasing products and services.',
    products: ['Enterprise Solutions'],
    services: ['Partner Consulting'],
    contactEmail: exhUser.email,
    applicationStatus: 'pending',
  });

  return profile;
};

// ─── @route   PUT /api/exhibitors/:id/approve ─────────────────────────────────
// ─── @access  Private / Admin
const approveApplication = async (req, res, next) => {
  try {
    const resolved = await resolveOrCreateProfile(req.params.id, req.body?.expoId);
    if (!resolved) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    const profile = await ExhibitorProfile.findByIdAndUpdate(
      resolved._id,
      { $set: { applicationStatus: 'approved', rejectionReason: '' } },
      { new: true, runValidators: true }
    )
      .populate('user', 'name email')
      .populate('expo', 'title');

    res.status(200).json({ success: true, profile });
  } catch (err) {
    next(err);
  }
};

// ─── @route   PUT /api/exhibitors/:id/reject ──────────────────────────────────
// ─── @access  Private / Admin
const rejectApplication = async (req, res, next) => {
  try {
    const { rejectionReason, expoId } = req.body;
    const resolved = await resolveOrCreateProfile(req.params.id, expoId);
    if (!resolved) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    // Also release any booth assigned to this exhibitor in this expo if rejected
    const Booth = require('../models/Booth');
    await Booth.updateMany(
      {
        $or: [
          { exhibitorProfile: resolved._id },
          { expo: resolved.expo, exhibitor: resolved.user },
        ],
      },
      { $set: { status: 'available', exhibitor: null, exhibitorProfile: null } }
    );

    const profile = await ExhibitorProfile.findByIdAndUpdate(
      resolved._id,
      {
        $set: {
          applicationStatus: 'rejected',
          rejectionReason: rejectionReason || 'Application rejected by organizer',
        },
      },
      { new: true, runValidators: true }
    )
      .populate('user', 'name email')
      .populate('expo', 'title');

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
