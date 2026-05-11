const rateLimit = require('express-rate-limit');
const { sendRateLimitError } = require('../utils/response');

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many submissions. Please try again in 15 minutes.',
  handler: (req, res) => {
    return sendRateLimitError(res);
  },
  skip: (req) => process.env.NODE_ENV === 'test', // Skip rate limiting in tests
});

module.exports = { contactLimiter };