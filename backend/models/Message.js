const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Sender is required'],
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Receiver is required'],
  },
  expo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Expo',
    default: null,
  },
  content: {
    type: String,
    required: [true, 'Message content is required'],
    trim: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for fast conversation lookups
MessageSchema.index({ sender: 1, receiver: 1, createdAt: -1 });

module.exports = mongoose.model('Message', MessageSchema);
