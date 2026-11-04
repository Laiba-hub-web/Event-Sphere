const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false, // Never return password by default
  },
  role: {
    type: String,
    enum: ['admin', 'exhibitor', 'attendee'],
    default: 'attendee',
  },
  avatar: {
    type: String,
    default: '',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ─── Pre-save Hook: Hash password ─────────────────────────────────────────────
UserSchema.pre('save', async function (next) {
  // Only hash if the password field was modified (or is new)
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ─── Instance Method: Compare entered password with stored hash ───────────────
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ─── Static Method: Generate signed JWT ──────────────────────────────────────
UserSchema.statics.generateAuthToken = function (userId, secret, expire) {
  return jwt.sign({ id: userId }, secret, { expiresIn: expire });
};

module.exports = mongoose.model('User', UserSchema);
