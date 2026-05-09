const express = require('express');
const router = express.Router();
const { sendContactEmail } = require('../services/email');
const { contactLimiter } = require('../middleware/rateLimit');

router.get('/', (req, res) => {
  res.render('index');
});

router.post('/contact', contactLimiter, async (req, res) => {
  const { name, email, message } = req.body;

  const MAX_NAME = 100;
  const MAX_EMAIL = 254;
  const MAX_MESSAGE = 5000;

  if (!name || !email || !message) {
    return res.status(400).json({
      status: 'error',
      message: 'Please fill in all fields before submitting the form.'
    });
  }

  if (typeof name !== 'string' || typeof email !== 'string' || typeof message !== 'string') {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid input format.'
    });
  }

  if (name.length > MAX_NAME || email.length > MAX_EMAIL || message.length > MAX_MESSAGE) {
    return res.status(400).json({
      status: 'error',
      message: 'Input exceeds maximum allowed length.'
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      status: 'error',
      message: 'Please provide a valid email address.'
    });
  }

  if (message.trim().length < 20) {
    return res.status(400).json({
      status: 'error',
      message: 'Message must be at least 20 characters long.'
    });
  }

  try {
    await sendContactEmail({ name, email, message });
    console.log(`[${new Date().toISOString()}] Contact submission received from ${email}`);
    return res.json({
      status: 'success',
      message: 'Thank you! Your message has been received successfully. You will hear back within 24-48 hours.'
    });
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Email send failed:`, error.message);
    const isSmtpError = error.message.includes('SMTP') || error.message.includes('Authentication') || error.code === 'EAUTH';
    return res.status(500).json({
      status: 'error',
      message: isSmtpError
        ? 'Email service is temporarily unavailable. Please try again later.'
        : 'Something went wrong. Please try again later.'
    });
  }
});

module.exports = router;
