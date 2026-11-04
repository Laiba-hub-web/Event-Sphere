/**
 * Global Express error handler.
 * Must be registered as the LAST middleware in server.js (after all routes).
 *
 * Handles common Mongoose and JWT error types with friendly messages.
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // ── Mongoose: Bad ObjectId (CastError) ───────────────────────────────────────
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Resource not found with id: ${err.value}`;
  }

  // ── Mongoose: Duplicate key (unique index violation) ─────────────────────────
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    const value = err.keyValue ? err.keyValue[field] : 'unknown';
    message = `Duplicate value: '${value}' already exists for field '${field}'`;
  }

  // ── Mongoose: Validation errors ───────────────────────────────────────────────
  if (err.name === 'ValidationError') {
    statusCode = 400;
    // Collect all validation messages into a single string
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
  }

  // ── JWT: Token malformed or invalid ──────────────────────────────────────────
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token. Please log in again.';
  }

  // ── JWT: Token expired ────────────────────────────────────────────────────────
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token has expired. Please log in again.';
  }

  // Log unexpected server errors (but not 4xx client errors)
  if (statusCode === 500) {
    console.error('❌ Unhandled error:', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    // Expose stack trace only in development
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
