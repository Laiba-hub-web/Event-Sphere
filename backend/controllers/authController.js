const crypto = require('crypto');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// ─── Helper: Send token response ─────────────────────────────────────────────
const sendTokenResponse = (user, statusCode, res) => {
  const token = User.generateAuthToken(
    user._id,
    process.env.JWT_SECRET,
    process.env.JWT_EXPIRE || '7d'
  );

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      isActive: user.isActive,
      createdAt: user.createdAt,
    },
  });
};

// ─── @route   POST /api/auth/register ─────────────────────────────────────────
// ─── @access  Public
const register = async (req, res, next) => {
  try {
    // Handle express-validator errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, password, role } = req.body;

    // Check for duplicate email
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: 'Email already registered' });
    }

    // Only allow valid roles; default to 'attendee' if not specified or invalid
    const allowedRoles = ['admin', 'exhibitor', 'attendee'];
    const userRole = allowedRoles.includes(role) ? role : 'attendee';

    const user = await User.create({ name, email, password, role: userRole });

    sendTokenResponse(user, 201, res);
  } catch (err) {
    next(err);
  }
};

// ─── @route   POST /api/auth/login ────────────────────────────────────────────
// ─── @access  Public
const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user and explicitly select the password field (it's excluded by default)
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      '+password'
    );

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res
        .status(401)
        .json({ success: false, message: 'Account has been deactivated' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid credentials' });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// ─── @route   GET /api/auth/me ────────────────────────────────────────────────
// ─── @access  Private
const getMe = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, user: req.user });
  } catch (err) {
    next(err);
  }
};

// ─── @route   POST /api/auth/forgot-password ──────────────────────────────────
// ─── @access  Public
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: 'Please provide an email address' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    // Always return success to prevent email enumeration
    if (!user) {
      return res.status(200).json({
        success: true,
        message:
          'If that email exists in our system, a reset link has been sent.',
      });
    }

    // Generate a raw token and its hashed version
    const rawToken = crypto.randomBytes(20).toString('hex');
    const hashedToken = crypto
      .createHash('sha256')
      .update(rawToken)
      .digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${rawToken}`;

    const html = `
      <h2>EventSphere — Password Reset</h2>
      <p>You requested a password reset. Click the link below to set a new password:</p>
      <a href="${resetUrl}" style="display:inline-block;padding:10px 20px;background:#6366f1;color:#fff;text-decoration:none;border-radius:5px;">Reset Password</a>
      <p>This link expires in <strong>10 minutes</strong>.</p>
      <p>If you did not request this, please ignore this email.</p>
    `;

    try {
      await sendEmail({ to: user.email, subject: 'EventSphere Password Reset', html });
    } catch (emailErr) {
      // Roll back token if email fails
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      return next(new Error('Email could not be sent. Please try again later.'));
    }

    res.status(200).json({
      success: true,
      message: 'If that email exists in our system, a reset link has been sent.',
    });
  } catch (err) {
    next(err);
  }
};

// ─── @route   PUT /api/auth/reset-password/:token ─────────────────────────────
// ─── @access  Public
const resetPassword = async (req, res, next) => {
  try {
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
    }

    // Hash the token from the URL to compare against stored hashed token
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }, // Token must not be expired
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid or expired reset token' });
    }

    // Set new password and clear reset fields
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// ─── @route   PUT /api/auth/profile ───────────────────────────────────────────
// ─── @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { name, email, avatar } = req.body;

    // Build the update object with only provided fields
    const fieldsToUpdate = {};
    if (name) fieldsToUpdate.name = name;
    if (email) fieldsToUpdate.email = email.toLowerCase();
    if (avatar !== undefined) fieldsToUpdate.avatar = avatar;

    // If a file was uploaded, use its path instead
    if (req.file) {
      fieldsToUpdate.avatar = `/uploads/${req.file.filename}`;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: fieldsToUpdate },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

// ─── @route   PUT /api/auth/change-password ───────────────────────────────────
// ─── @access  Private
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password',
      });
    }

    const user = await User.findById(req.user._id);
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  updateProfile,
  changePassword,
};
