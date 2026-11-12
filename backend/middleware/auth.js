const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Fast in-memory user cache (60s TTL) to avoid redundant MongoDB Atlas round-trips on every request
const userCache = new Map();
const USER_CACHE_TTL = 60 * 1000;

const clearUserCache = (userId) => {
  if (userId) {
    userCache.delete(userId.toString());
  } else {
    userCache.clear();
  }
};

/**
 * protect middleware
 * Verifies the JWT from the Authorization Bearer header and attaches
 * the authenticated user (without password) to req.user.
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const uid = decoded.id.toString();

    const cached = userCache.get(uid);
    if (cached && cached.expiresAt > Date.now()) {
      req.user = cached.user;
    } else {
      const userDoc = await User.findById(uid).select('-password').lean();
      if (!userDoc) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized, user no longer exists',
        });
      }
      userCache.set(uid, { user: userDoc, expiresAt: Date.now() + USER_CACHE_TTL });
      req.user = userDoc;
    }

    if (!req.user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Your account has been deactivated',
      });
    }

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token is invalid or expired',
    });
  }
};

/**
 * authorize(...roles) middleware factory
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user.role}' is not authorized to access this resource`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize, clearUserCache };
