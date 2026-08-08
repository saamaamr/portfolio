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
  const errors = {};

  if (name === undefined || name === null || name === '') {
    errors.name = 'Name is required.';
  }
  if (email === undefined || email === null || email === '') {
    errors.email = 'Email is required.';
  }
  if (message === undefined || message === null || message === '') {
    errors.message = 'Message is required.';
  }

  const hasInvalidType = [name, email, message].some(
    (value) => value !== undefined && value !== null && typeof value !== 'string'
  );
  if (hasInvalidType) {
    return {
      status: 'error',
      message: 'Invalid input format.',
      data: null,
      errors: { form: 'Invalid input format.' },
    };
  }

  if (typeof name === 'string' && !errors.name) {
    if (!name.trim()) errors.name = 'Name is required.';
    else if (name.length > MAX_NAME) errors.name = 'Name must not exceed 100 characters.';
  }

  if (typeof email === 'string' && !errors.email) {
    if (!email.trim()) errors.email = 'Email is required.';
    else if (email.length > MAX_EMAIL) errors.email = 'Email must not exceed 254 characters.';
    else if (!validator.validate(email)) errors.email = 'Please provide a valid email address.';
  }

  if (typeof message === 'string' && !errors.message) {
    if (!message.trim()) errors.message = 'Message is required.';
    else if (message.length > MAX_MESSAGE) errors.message = 'Message must not exceed 5000 characters.';
    else if (message.trim().length < 20) errors.message = 'Message must be at least 20 characters long.';
  }

  if (Object.keys(errors).length > 0) {
    const firstError = Object.values(errors)[0];
    const hasRequiredError = Object.values(errors).some((error) => error.includes('is required'));
    const exceedsMaximum = Object.values(errors).some((error) => error.includes('must not exceed'));
    return {
      status: 'error',
      message: hasRequiredError
        ? 'Please fill in all fields before submitting the form.'
        : exceedsMaximum
          ? 'Input exceeds maximum allowed length.'
          : firstError,
      data: null,
      errors,
    };
  }

  return {
    status: 'success',
    message: 'Validation passed.',
    data: { name, email, message },
    errors: {},
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
