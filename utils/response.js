/**
 * Standardized JSON response format
 */
const sendResponse = (res, statusCode, status, message, data = null) => {
  return res.status(statusCode).json({
    status,
    message,
    data,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Send success response
 */
const sendSuccess = (res, message, data = null, statusCode = 200) => {
  return sendResponse(res, statusCode, 'success', message, data);
};

/**
 * Send error response
 */
const sendError = (res, message, data = null, statusCode = 400) => {
  return sendResponse(res, statusCode, 'error', message, data);
};

/**
 * Send validation error response
 */
const sendValidationError = (res, message, data = null) => {
  return sendError(res, message, data, 400);
};

/**
 * Send server error response
 */
const sendServerError = (res, message = 'Internal server error.', data = null) => {
  return sendError(res, message, data, 500);
};

/**
 * Send rate limit error
 */
const sendRateLimitError = (res) => {
  return sendError(res, 'Too many requests. Please try again later.', null, 429);
};

/**
 * Send not found error
 */
const sendNotFound = (res) => {
  return sendError(res, 'Resource not found.', null, 404);
};

module.exports = {
  sendResponse,
  sendSuccess,
  sendError,
  sendValidationError,
  sendServerError,
  sendRateLimitError,
  sendNotFound,
};
