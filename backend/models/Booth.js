const mongoose = require('mongoose');

const BoothSchema = new mongoose.Schema({
  expo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Expo',
    required: [true, 'Expo reference is required'],
  },
  number: {
    type: String,
    required: [true, 'Booth number is required'],
    trim: true,
  },
  row: {
    type: Number,
  },
  column: {
    type: Number,
  },
  size: {
    type: String,
    enum: ['small', 'medium', 'large'],
    default: 'medium',
  },
  status: {
    type: String,
    enum: ['available', 'reserved', 'occupied'],
    default: 'available',
  },
  exhibitor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  exhibitorProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExhibitorProfile',
    default: null,
  },
  price: {
    type: Number,
    default: 0,
    min: 0,
  },
  notes: {
    type: String,
    trim: true,
  },
});

// Compound index to ensure unique booth numbers per expo
BoothSchema.index({ expo: 1, number: 1 }, { unique: true });

module.exports = mongoose.model('Booth', BoothSchema);
