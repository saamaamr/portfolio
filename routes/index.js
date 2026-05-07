const express = require('express');
const router = express.Router();
const { sendContactEmail } = require('../services/email');
const { contactLimiter } = require('../middleware/rateLimit');

router.get('/', (req, res) => {
  res.render('index');
});

router.post('/contact', contactLimiter, async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      status: 'error',
      message: 'Please fill in all fields before submitting the form.'
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      status: 'error',
      message: 'Please provide a valid email address.'
    });
  }

  if (message.length < 10) {
    return res.status(400).json({
      status: 'error',
      message: 'Message must be at least 10 characters long.'
    });
  }

  try {
    await sendContactEmail({ name, email, message });
  } catch (error) {
    console.error('Email send failed:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong. Please try again later.'
    });
  }

  console.log('New contact submission:');
  console.log(`Name: ${name}`);
  console.log(`Email: ${email}`);
  console.log(`Message: ${message}`);

  return res.json({
    status: 'success',
    message: 'Thank you! Your message has been received successfully.'
  });
});

module.exports = router;
