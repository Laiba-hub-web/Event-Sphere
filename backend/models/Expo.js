const mongoose = require('mongoose');

const ExpoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Expo title is required'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  date: {
    type: Date,
    required: [true, 'Start date is required'],
  },
  endDate: {
    type: Date,
  },
  location: {
    type: String,
    trim: true,
  },
  theme: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'ongoing', 'completed', 'cancelled'],
    default: 'draft',
  },
  bannerImage: {
    type: String,
    default: '',
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Organizer is required'],
  },
  boothRows: {
    type: Number,
    default: 5,
    min: 1,
  },
  boothColumns: {
    type: Number,
    default: 10,
    min: 1,
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Expo', ExpoSchema);
