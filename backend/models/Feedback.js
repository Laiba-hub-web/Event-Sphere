const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required'],
  },
  expo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Expo',
    required: [true, 'Expo reference is required'],
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5'],
  },
  message: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    enum: ['general', 'booth', 'session', 'logistics'],
    default: 'general',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound unique index: one feedback submission per user per expo
FeedbackSchema.index({ user: 1, expo: 1 }, { unique: true });

module.exports = mongoose.model('Feedback', FeedbackSchema);
