const jwt = require('jsonwebtoken');
const User = require('../models/User');

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

    // Fetch user and exclude password
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, user no longer exists',
      });
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
 * Restricts access to users whose role matches one of the provided roles.
 * Must be used AFTER the protect middleware.
 *
 * @param {...string} roles - Allowed roles (e.g., 'admin', 'exhibitor')
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

module.exports = { protect, authorize };
