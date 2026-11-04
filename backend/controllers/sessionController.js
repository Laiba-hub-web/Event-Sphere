const Session = require('../models/Session');
const Expo = require('../models/Expo');

// ─── @route   GET /api/sessions/expo/:expoId ─────────────────────────────────
// ─── @access  Public / authenticated users
const getSessionsByExpo = async (req, res, next) => {
  try {
    const sessions = await Session.find({ expo: req.params.expoId })
      .populate('attendees.user', 'name email avatar')
      .sort({ startTime: 1 });

    res.status(200).json({
      success: true,
      count: sessions.length,
      sessions,
    });
  } catch (err) {
    next(err);
  }
};

// ─── @route   GET /api/sessions/:id ──────────────────────────────────────────
// ─── @access  Public / authenticated users
const getSession = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate('expo', 'title date location')
      .populate('attendees.user', 'name email avatar');

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    res.status(200).json({ success: true, session });
  } catch (err) {
    next(err);
  }
};

// ─── @route   POST /api/sessions ─────────────────────────────────────────────
// ─── @access  Private / Admin
const createSession = async (req, res, next) => {
  try {
    const { expo, expoId, title, speaker, speakerBio, topic, description, location, startTime, endTime, capacity } = req.body;
    const targetExpoId = expo || expoId;

    if (!targetExpoId) {
      return res.status(400).json({ success: false, message: 'Expo ID is required' });
    }

    const session = await Session.create({
      expo: targetExpoId,
      title,
      speaker,
      speakerBio,
      topic,
      description,
      location,
      startTime,
      endTime,
      capacity: capacity || 100,
    });

    res.status(201).json({ success: true, session });
  } catch (err) {
    next(err);
  }
};

// ─── @route   PUT /api/sessions/:id ──────────────────────────────────────────
// ─── @access  Private / Admin
const updateSession = async (req, res, next) => {
  try {
    const session = await Session.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    res.status(200).json({ success: true, session });
  } catch (err) {
    next(err);
  }
};

// ─── @route   DELETE /api/sessions/:id ───────────────────────────────────────
// ─── @access  Private / Admin
const deleteSession = async (req, res, next) => {
  try {
    const session = await Session.findByIdAndDelete(req.params.id);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    res.status(200).json({ success: true, message: 'Session deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// ─── @route   POST /api/sessions/:id/bookmark ────────────────────────────────
// ─── @access  Private / Attendee
const bookmarkSession = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    const isBookmarked = session.attendees.some(
      (a) => a.user.toString() === req.user._id.toString()
    );

    if (!isBookmarked) {
      session.attendees.push({
        user: req.user._id,
        registeredAt: new Date(),
      });
      await session.save();
    }

    res.status(200).json({ success: true, bookmarked: true, session });
  } catch (err) {
    next(err);
  }
};

// ─── @route   DELETE /api/sessions/:id/bookmark ──────────────────────────────
// ─── @access  Private / Attendee
const unbookmarkSession = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    session.attendees = session.attendees.filter(
      (a) => a.user.toString() !== req.user._id.toString()
    );
    await session.save();

    res.status(200).json({ success: true, bookmarked: false, session });
  } catch (err) {
    next(err);
  }
};

// ─── @route   GET /api/sessions/my-bookmarks ─────────────────────────────────
// ─── @access  Private / Attendee
const getMyBookmarks = async (req, res, next) => {
  try {
    const sessions = await Session.find({
      'attendees.user': req.user._id,
    })
      .populate('expo', 'title date location bannerImage')
      .sort({ startTime: 1 });

    res.status(200).json({
      success: true,
      count: sessions.length,
      sessions,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getSessionsByExpo,
  getSession,
  createSession,
  updateSession,
  deleteSession,
  bookmarkSession,
  unbookmarkSession,
  getMyBookmarks,
};
