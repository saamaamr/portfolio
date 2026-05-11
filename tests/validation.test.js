const {
  validateContactForm,
  escapeHtml,
  sanitizeHtml,
} = require('../utils/validation');

describe('Validation Utils', () => {
  describe('validateContactForm', () => {
    it('should pass with valid inputs', () => {
      const result = validateContactForm(
        'John Doe',
        'john@example.com',
        'This is a valid message with enough characters'
      );
      expect(result.status).toBe('success');
    });

    it('should fail with missing fields', () => {
      const result = validateContactForm('John', '', 'message');
      expect(result.status).toBe('error');
      expect(result.message).toContain('fill in all fields');
    });

    it('should fail with invalid email', () => {
      const result = validateContactForm('John', 'invalid-email', 'This is a valid message');
      expect(result.status).toBe('error');
      expect(result.message).toContain('valid email');
    });

    it('should fail with message too short', () => {
      const result = validateContactForm('John', 'john@example.com', 'Short');
      expect(result.status).toBe('error');
      expect(result.message).toContain('at least 20 characters');
    });

    it('should fail with input exceeding max length', () => {
      const longName = 'a'.repeat(101);
      const result = validateContactForm(longName, 'john@example.com', 'Valid message');
      expect(result.status).toBe('error');
      expect(result.message).toContain('exceeds maximum');
    });
  });

  describe('escapeHtml', () => {
    it('should escape HTML special characters', () => {
      const input = '<script>alert("XSS")</script>';
      const output = escapeHtml(input);
      expect(output).not.toContain('<script>');
      expect(output).toContain('&lt;script&gt;');
    });

    it('should escape quotes', () => {
      const input = 'He said "hello"';
      const output = escapeHtml(input);
      expect(output).toContain('&quot;');
    });
  });

  describe('sanitizeHtml', () => {
    it('should remove all HTML tags', () => {
      const input = '<div>Safe content</div>';
      const output = sanitizeHtml(input);
      expect(output).not.toContain('<div>');
      expect(output).toContain('Safe content');
    });
  });
});
