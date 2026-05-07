const rateLimit = require('express-rate-limit');

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    status: 'error',
    message: 'Too many submissions. Please try again in 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { contactLimiter };