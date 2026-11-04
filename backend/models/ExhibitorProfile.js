const mongoose = require('mongoose');

const ExhibitorProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required'],
  },
  expo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Expo',
  },
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  products: [String],
  services: [String],
  logo: {
    type: String,
    default: '',
  },
  website: {
    type: String,
    trim: true,
  },
  contactEmail: {
    type: String,
    trim: true,
    lowercase: true,
  },
  contactPhone: {
    type: String,
    trim: true,
  },
  documents: [String], // Array of file paths/URLs for uploaded documents
  applicationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  rejectionReason: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound unique index: one application per user per expo
ExhibitorProfileSchema.index({ user: 1, expo: 1 }, { unique: true });

module.exports = mongoose.model('ExhibitorProfile', ExhibitorProfileSchema);
