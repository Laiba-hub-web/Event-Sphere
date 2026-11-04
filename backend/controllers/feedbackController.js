const Feedback = require('../models/Feedback');

// ─── @route   POST /api/feedback ─────────────────────────────────────────────
// ─── @access  Private
const submitFeedback = async (req, res, next) => {
  try {
    const { expo, expoId, rating, message, category } = req.body;
    const targetExpoId = expo || expoId;

    if (!targetExpoId || !rating) {
      return res.status(400).json({
        success: false,
        message: 'Expo and rating are required',
      });
    }

    const feedback = await Feedback.findOneAndUpdate(
      { user: req.user._id, expo: targetExpoId },
      {
        $set: {
          rating,
          message: message || '',
          category: category || 'general',
          createdAt: new Date(),
        },
      },
      { new: true, upsert: true, runValidators: true }
    ).populate('user', 'name email avatar');

    res.status(201).json({ success: true, feedback });
  } catch (err) {
    next(err);
  }
};

// ─── @route   GET /api/feedback/expo/:expoId ─────────────────────────────────
// ─── @access  Private / Admin
const getByExpo = async (req, res, next) => {
  try {
    const feedbackList = await Feedback.find({ expo: req.params.expoId })
      .populate('user', 'name email avatar')
      .sort({ createdAt: -1 });

    const totalRatings = feedbackList.length;
    const avgRating =
      totalRatings > 0
        ? (feedbackList.reduce((acc, f) => acc + f.rating, 0) / totalRatings).toFixed(1)
        : 0;

    res.status(200).json({
      success: true,
      count: totalRatings,
      avgRating: Number(avgRating),
      feedback: feedbackList,
    });
  } catch (err) {
    next(err);
  }
};

// ─── @route   GET /api/feedback/session/:sessionId ───────────────────────────
// ─── @access  Private
const getBySession = async (req, res, next) => {
  try {
    // Return empty array / placeholder if session specific feedback is queried
    res.status(200).json({
      success: true,
      count: 0,
      feedback: [],
    });
  } catch (err) {
    next(err);
  }
};

// ─── @route   GET /api/feedback/my ───────────────────────────────────────────
// ─── @access  Private
const getMyFeedback = async (req, res, next) => {
  try {
    const feedbackList = await Feedback.find({ user: req.user._id })
      .populate('expo', 'title date location')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: feedbackList.length,
      feedback: feedbackList,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  submitFeedback,
  getByExpo,
  getBySession,
  getMyFeedback,
};
