const express = require('express');
const router = express.Router();
const { sendContactEmail } = require('../services/email');
const { contactLimiter } = require('../middleware/rateLimit');
const { asyncHandler } = require('../utils/errorHandler');
const { validateContactForm, escapeHtml } = require('../utils/validation');
const { sendSuccess, sendValidationError, sendServerError } = require('../utils/response');

router.get('/', (req, res) => {
  res.render('index');
});

router.post(
  '/contact',
  contactLimiter,
  asyncHandler(async (req, res) => {
    const { name, email, message } = req.body;

    // Validate input
    const validation = validateContactForm(name, email, message);
    if (validation.status === 'error') {
      return sendValidationError(res, validation.message);
    }

    try {
      await sendContactEmail(validation.data);
      return sendSuccess(
        res,
        'Thank you! Your message has been received successfully. You will hear back within 24-48 hours.'
      );
    } catch (error) {
      const isSmtpError =
        error.message.includes('SMTP') ||
        error.message.includes('Authentication') ||
        error.code === 'EAUTH';

      return sendServerError(
        res,
        isSmtpError
          ? 'Email service is temporarily unavailable. Please try again later.'
          : 'Something went wrong. Please try again later.',
        null,
        isSmtpError ? 503 : 500
      );
    }
  })
);

module.exports = router;
