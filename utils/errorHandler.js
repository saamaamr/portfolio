const logger = require('./logger');
const { sendServerError } = require('./response');

/**
 * Global error handling middleware
 * Must be placed at the end of all other middleware/routes
 */
const errorHandler = (err, req, res, next) => {
  // Log error with full details
  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
  });

  // Default error status and message
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error.';

  // Distinguish between error types
  if (err.code === 'SMTP_ERROR' || err.code === 'EAUTH') {
    statusCode = 503;
    message = 'Email service is temporarily unavailable. Please try again later.';
  } else if (err.code === 'VALIDATION_ERROR') {
    statusCode = 400;
  } else if (statusCode === 500) {
    // Don't expose internal error details in production
    message = process.env.NODE_ENV === 'production' ? 'Something went wrong. Please try again later.' : message;
  }

  return sendServerError(res, message, null, statusCode);
};

/**
 * Async route wrapper to catch errors
 * Usage: router.get('/', asyncHandler(async (req, res) => { ... }))
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  errorHandler,
  asyncHandler,
};
