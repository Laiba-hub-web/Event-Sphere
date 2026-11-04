const Registration = require('../models/Registration');
const Booth = require('../models/Booth');
const Session = require('../models/Session');
const ExhibitorProfile = require('../models/ExhibitorProfile');
const Feedback = require('../models/Feedback');

// ─── @route   GET /api/analytics/expo/:expoId ────────────────────────────────
// ─── @access  Private / Admin
const getExpoAnalytics = async (req, res, next) => {
  try {
    const expoId = req.params.expoId;

    const [
      totalRegistrations,
      confirmedRegistrations,
      booths,
      sessions,
      approvedExhibitors,
      feedbacks,
    ] = await Promise.all([
      Registration.countDocuments({ expo: expoId }),
      Registration.countDocuments({ expo: expoId, status: 'confirmed' }),
      Booth.find({ expo: expoId }),
      Session.find({ expo: expoId }),
      ExhibitorProfile.countDocuments({ expo: expoId, applicationStatus: 'approved' }),
      Feedback.find({ expo: expoId }),
    ]);

    const totalBooths = booths.length;
    const occupiedBooths = booths.filter((b) => b.status === 'occupied').length;
    const reservedBooths = booths.filter((b) => b.status === 'reserved').length;
    const availableBooths = booths.filter((b) => b.status === 'available').length;
    const occupancyRate =
      totalBooths > 0 ? Math.round(((occupiedBooths + reservedBooths) / totalBooths) * 100) : 0;

    const avgFeedbackRating =
      feedbacks.length > 0
        ? Number((feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1))
        : 0;

    res.status(200).json({
      success: true,
      analytics: {
        totalRegistrations,
        confirmedRegistrations,
        totalBooths,
        occupiedBooths,
        reservedBooths,
        availableBooths,
        occupancyRate,
        totalSessions: sessions.length,
        approvedExhibitors,
        feedbackCount: feedbacks.length,
        avgFeedbackRating,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ─── @route   GET /api/analytics/expo/:expoId/registrations ──────────────────
// ─── @access  Private / Admin
const getRegistrationsOverTime = async (req, res, next) => {
  try {
    const expoId = req.params.expoId;

    // Aggregate registrations by date (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const data = await Registration.aggregate([
      {
        $match: {
          expo: new (require('mongoose').Types.ObjectId)(expoId),
          registeredAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$registeredAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          date: '$_id',
          count: 1,
        },
      },
    ]);

    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// ─── @route   GET /api/analytics/expo/:expoId/sessions ───────────────────────
// ─── @access  Private / Admin
const getSessionPopularity = async (req, res, next) => {
  try {
    const expoId = req.params.expoId;

    const sessions = await Session.find({ expo: expoId })
      .select('title speaker capacity attendees')
      .sort({ 'attendees.length': -1 });

    const data = sessions.map((s) => ({
      id: s._id,
      title: s.title,
      speaker: s.speaker,
      capacity: s.capacity,
      attendeeCount: s.attendees ? s.attendees.length : 0,
      fillRate:
        s.capacity > 0
          ? Math.round(((s.attendees ? s.attendees.length : 0) / s.capacity) * 100)
          : 0,
    }));

    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// ─── @route   GET /api/analytics/expo/:expoId/booths ─────────────────────────
// ─── @access  Private / Admin
const getBoothStats = async (req, res, next) => {
  try {
    const expoId = req.params.expoId;

    const booths = await Booth.find({ expo: expoId });
    const available = booths.filter((b) => b.status === 'available').length;
    const reserved = booths.filter((b) => b.status === 'reserved').length;
    const occupied = booths.filter((b) => b.status === 'occupied').length;

    const data = [
      { name: 'Available', value: available, color: '#10b981' },
      { name: 'Reserved', value: reserved, color: '#f59e0b' },
      { name: 'Occupied', value: occupied, color: '#ef4444' },
    ];

    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getExpoAnalytics,
  getRegistrationsOverTime,
  getSessionPopularity,
  getBoothStats,
};

