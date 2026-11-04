const mongoose = require('mongoose');

const RegistrationSchema = new mongoose.Schema({
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
  sessions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session',
    },
  ],
  qrCode: {
    type: String,
    unique: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'confirmed',
  },
  paymentStatus: {
    type: String,
    enum: ['free', 'paid'],
    default: 'free',
  },
  registeredAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound unique index: one registration per user per expo
RegistrationSchema.index({ user: 1, expo: 1 }, { unique: true });

module.exports = mongoose.model('Registration', RegistrationSchema);
