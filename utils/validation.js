const validator = require('email-validator');
const xss = require('xss');

/**
 * Validate contact form inputs
 * @returns { status, message, data }
 */
const validateContactForm = (name, email, message) => {
  const MAX_NAME = 100;
  const MAX_EMAIL = 254;
  const MAX_MESSAGE = 5000;

  // Check required fields
  if (!name || !email || !message) {
    return {
      status: 'error',
      message: 'Please fill in all fields before submitting the form.',
      data: null,
    };
  }

  // Type validation
  if (typeof name !== 'string' || typeof email !== 'string' || typeof message !== 'string') {
    return {
      status: 'error',
      message: 'Invalid input format.',
      data: null,
    };
  }

  // Length validation
  if (name.length > MAX_NAME || email.length > MAX_EMAIL || message.length > MAX_MESSAGE) {
    return {
      status: 'error',
      message: 'Input exceeds maximum allowed length.',
      data: null,
    };
  }

  // Email validation using email-validator
  if (!validator.validate(email)) {
    return {
      status: 'error',
      message: 'Please provide a valid email address.',
      data: null,
    };
  }

  // Message length validation
  if (message.trim().length < 20) {
    return {
      status: 'error',
      message: 'Message must be at least 20 characters long.',
      data: null,
    };
  }

  return {
    status: 'success',
    message: 'Validation passed.',
    data: { name, email, message },
  };
};

/**
 * Sanitize HTML to prevent XSS
 */
const sanitizeHtml = (str) => {
  return xss(str, {
    whiteList: {},
    stripIgnoredTag: true,
  });
};

/**
 * Sanitize input for safe HTML display
 */
const escapeHtml = (str) =>
  String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');

/**
 * Trim and normalize whitespace
 */
const normalizeInput = (str) => {
  return String(str).trim().replace(/\s+/g, ' ');
};

module.exports = {
  validateContactForm,
  sanitizeHtml,
  escapeHtml,
  normalizeInput,
};
