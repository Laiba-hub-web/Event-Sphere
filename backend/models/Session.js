const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  expo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Expo',
    required: [true, 'Expo reference is required'],
  },
  title: {
    type: String,
    required: [true, 'Session title is required'],
    trim: true,
  },
  speaker: {
    type: String,
    trim: true,
  },
  speakerBio: {
    type: String,
    trim: true,
  },
  topic: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  location: {
    type: String,
    trim: true,
  },
  startTime: {
    type: Date,
    required: [true, 'Session start time is required'],
  },
  endTime: {
    type: Date,
    required: [true, 'Session end time is required'],
  },
  capacity: {
    type: Number,
    default: 100,
    min: 1,
  },
  attendees: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      registeredAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  status: {
    type: String,
    enum: ['scheduled', 'ongoing', 'completed', 'cancelled'],
    default: 'scheduled',
  },
});

module.exports = mongoose.model('Session', SessionSchema);
