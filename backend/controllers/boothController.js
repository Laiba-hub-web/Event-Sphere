const Booth = require('../models/Booth');
const ExhibitorProfile = require('../models/ExhibitorProfile');

// ─── @route   GET /api/booths/expo/:expoId ───────────────────────────────────
// ─── @access  Public / authenticated users
const getBoothsByExpo = async (req, res, next) => {
  try {
    const booths = await Booth.find({ expo: req.params.expoId })
      .populate('exhibitor', 'name email avatar')
      .populate('exhibitorProfile', 'company logo description')
      .sort({ row: 1, column: 1 });

    res.status(200).json({ success: true, count: booths.length, booths });
  } catch (err) {
    next(err);
  }
};

// ─── @route   PUT /api/booths/:id ────────────────────────────────────────────
// ─── @access  Private / Admin — update booth details (size, price, notes)
const updateBooth = async (req, res, next) => {
  try {
    const allowedUpdates = ['size', 'price', 'notes', 'number'];
    const updateData = {};
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) updateData[field] = req.body[field];
    });

    const booth = await Booth.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    )
      .populate('exhibitor', 'name email')
      .populate('exhibitorProfile', 'company logo');

    if (!booth) {
      return res
        .status(404)
        .json({ success: false, message: 'Booth not found' });
    }

    res.status(200).json({ success: true, booth });
  } catch (err) {
    next(err);
  }
};

// ─── @route   PUT /api/booths/:id/assign ─────────────────────────────────────
// ─── @access  Private / Admin — assign booth to a specific exhibitor
const assignBooth = async (req, res, next) => {
  try {
    const { exhibitorId, exhibitorProfileId } = req.body;

    if (!exhibitorId) {
      return res
        .status(400)
        .json({ success: false, message: 'exhibitorId is required' });
    }

    const targetBooth = await Booth.findById(req.params.id);
    if (!targetBooth) {
      return res
        .status(404)
        .json({ success: false, message: 'Booth not found' });
    }

    // Resolve or auto-create an approved ExhibitorProfile for this expo + exhibitor
    let profileId = exhibitorProfileId;
    if (!profileId) {
      let profile = await ExhibitorProfile.findOne({
        user: exhibitorId,
        expo: targetBooth.expo,
      });

      if (!profile) {
        const anyProfile = await ExhibitorProfile.findOne({ user: exhibitorId });
        const User = require('../models/User');
        const exhUser = await User.findById(exhibitorId);

        profile = await ExhibitorProfile.create({
          user: exhibitorId,
          expo: targetBooth.expo,
          company: anyProfile?.company || `${exhUser?.name || 'Partner'} Systems`,
          description:
            anyProfile?.description ||
            'Official exhibiting partner showcasing enterprise hardware and software solutions.',
          products: anyProfile?.products?.length
            ? anyProfile.products
            : ['Flagship Enterprise Platform'],
          services: anyProfile?.services?.length
            ? anyProfile.services
            : ['B2B Integration & Support'],
          website: anyProfile?.website || 'https://eventsphere.example.com',
          contactEmail: anyProfile?.contactEmail || exhUser?.email || '',
          contactPhone: anyProfile?.contactPhone || '+1 (800) 555-0199',
          logo: anyProfile?.logo || '',
          applicationStatus: 'approved',
        });
      } else if (profile.applicationStatus !== 'approved') {
        profile.applicationStatus = 'approved';
        await profile.save();
      }

      profileId = profile._id;
    }

    const booth = await Booth.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          exhibitor: exhibitorId,
          exhibitorProfile: profileId || null,
          status: 'occupied',
        },
      },
      { new: true, runValidators: true }
    )
      .populate('exhibitor', 'name email')
      .populate('exhibitorProfile', 'company logo');

    res.status(200).json({ success: true, booth });
  } catch (err) {
    next(err);
  }
};

// ─── @route   PUT /api/booths/:id/reserve ────────────────────────────────────
// ─── @access  Private / Exhibitor
const reserveBooth = async (req, res, next) => {
  try {
    // Check the booth is currently available
    const existing = await Booth.findById(req.params.id);

    if (!existing) {
      return res
        .status(404)
        .json({ success: false, message: 'Booth not found' });
    }

    if (existing.status !== 'available') {
      return res.status(400).json({
        success: false,
        message: `Booth is currently '${existing.status}' and cannot be reserved`,
      });
    }

    // Fetch the exhibitor's profile for this expo (if any)
    const profile = await ExhibitorProfile.findOne({
      user: req.user._id,
      expo: existing.expo,
    });

    const booth = await Booth.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          exhibitor: req.user._id,
          exhibitorProfile: profile ? profile._id : null,
          status: 'reserved',
        },
      },
      { new: true }
    )
      .populate('exhibitor', 'name email')
      .populate('exhibitorProfile', 'company logo');

    res.status(200).json({ success: true, booth });
  } catch (err) {
    next(err);
  }
};

// ─── @route   PUT /api/booths/:id/release ────────────────────────────────────
// ─── @access  Private / Exhibitor (own booth) or Admin
const releaseBooth = async (req, res, next) => {
  try {
    const booth = await Booth.findById(req.params.id);

    if (!booth) {
      return res
        .status(404)
        .json({ success: false, message: 'Booth not found' });
    }

    // Exhibitors can only release their own booth; admins can release any
    if (
      req.user.role !== 'admin' &&
      (!booth.exhibitor || booth.exhibitor.toString() !== req.user._id.toString())
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to release this booth',
      });
    }

    const updated = await Booth.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          exhibitor: null,
          exhibitorProfile: null,
          status: 'available',
        },
      },
      { new: true }
    );

    res.status(200).json({ success: true, booth: updated });
  } catch (err) {
    next(err);
  }
};

// ─── @route   GET /api/booths/:id ────────────────────────────────────────────
// ─── @access  Public / authenticated users
const getBooth = async (req, res, next) => {
  try {
    const booth = await Booth.findById(req.params.id)
      .populate('expo', 'title date location')
      .populate('exhibitor', 'name email avatar')
      .populate('exhibitorProfile', 'company logo description website contactEmail contactPhone');

    if (!booth) {
      return res.status(404).json({ success: false, message: 'Booth not found' });
    }

    res.status(200).json({ success: true, booth });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getBoothsByExpo,
  getBooth,
  updateBooth,
  assignBooth,
  reserveBooth,
  releaseBooth,
};
