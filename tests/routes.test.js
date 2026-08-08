const request = require('supertest');
const { sendContactEmail } = require('../services/email');

jest.mock('../services/email', () => ({
  sendContactEmail: jest.fn(),
}));

const app = require('../app');

describe('API Routes', () => {
  beforeEach(() => {
    sendContactEmail.mockReset();
    sendContactEmail.mockResolvedValue(undefined);
  });

  describe('GET /', () => {
    it('should render the index page', async () => {
      const res = await request(app).get('/');
      expect(res.status).toBe(200);
    });

    it('should authorize the rendered JSON-LD nonce in the CSP header', async () => {
      const res = await request(app).get('/');
      const policy = res.headers['content-security-policy'];
      const nonceMatch = policy.match(/'nonce-([^']+)'/);

      expect(nonceMatch).not.toBeNull();
      expect(res.text).toContain(`type="application/ld+json" nonce="${nonceMatch[1]}"`);
    });
  });

  describe('POST /contact - Validation', () => {
    it('should return validation error with missing fields', async () => {
      const res = await request(app)
        .post('/contact')
        .send({
          name: 'John',
          email: '',
          message: 'Test message',
        });
      expect(res.status).toBe(400);
      expect(res.body.status).toBe('error');
      expect(res.body.data.errors).toEqual({
        email: 'Email is required.',
        message: 'Message must be at least 20 characters long.',
      });
    });

    it('should return validation error with invalid email', async () => {
      const res = await request(app)
        .post('/contact')
        .send({
          name: 'John Doe',
          email: 'invalid-email',
          message: 'This is a valid message with enough characters to pass validation',
        });
      expect(res.status).toBe(400);
      expect(res.body.status).toBe('error');
      expect(res.body.message).toContain('valid email');
    });

    it('should return validation error with short message', async () => {
      const res = await request(app)
        .post('/contact')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          message: 'Too short',
        });
      expect(res.status).toBe(400);
      expect(res.body.status).toBe('error');
      expect(res.body.message).toContain('20 characters');
    });

    it('should have standardized error response format', async () => {
      const res = await request(app)
        .post('/contact')
        .send({
          name: '',
          email: '',
          message: '',
        });
      expect(res.body).toHaveProperty('status');
      expect(res.body).toHaveProperty('message');
      expect(res.body).toHaveProperty('timestamp');
      expect(res.body.status).toBe('error');
    });

    it('should validate email max length', async () => {
      const longEmail = 'a'.repeat(255) + '@test.com';
      const res = await request(app)
        .post('/contact')
        .send({
          name: 'John',
          email: longEmail,
          message: 'This is a valid message with enough characters',
        });
      expect(res.status).toBe(400);
      expect(res.body.status).toBe('error');
    });

    it('should validate name max length', async () => {
      const longName = 'a'.repeat(101);
      const res = await request(app)
        .post('/contact')
        .send({
          name: longName,
          email: 'john@example.com',
          message: 'This is a valid message with enough characters',
        });
      expect(res.status).toBe(400);
      expect(res.body.status).toBe('error');
    });

    it('should send a valid contact submission', async () => {
      const res = await request(app).post('/contact').send({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'I would like to discuss a support engineering opportunity.',
      });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data).toBeNull();
    });

    it('should return 503 when SMTP authentication fails', async () => {
      const smtpError = new Error('Authentication failed');
      smtpError.code = 'EAUTH';
      sendContactEmail.mockRejectedValueOnce(smtpError);

      const res = await request(app).post('/contact').send({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'I would like to discuss a support engineering opportunity.',
      });

      expect(res.status).toBe(503);
      expect(res.body.status).toBe('error');
      expect(res.body.message).toContain('temporarily unavailable');
    });

    it('should return 413 for JSON payloads larger than 10 KB', async () => {
      const res = await request(app).post('/contact').send({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'a'.repeat(11000),
      });

      expect(res.status).toBe(413);
      expect(res.body.status).toBe('error');
    });
  });

  describe('404 Error', () => {
    it('should render a noindex 404 page for unknown routes', async () => {
      const res = await request(app).get('/unknown-route');
      expect(res.status).toBe(404);
      expect(res.text).toContain('Page Not Found');
      expect(res.text).toContain('name="robots" content="noindex, nofollow"');
      expect(res.text).not.toContain('rel="canonical"');
    });
  });
});
