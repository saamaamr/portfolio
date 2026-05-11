const request = require('supertest');
const app = require('../app');

describe('API Routes', () => {
  describe('GET /', () => {
    it('should render the index page', async () => {
      const res = await request(app).get('/');
      expect(res.status).toBe(200);
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
  });

  describe('404 Error', () => {
    it('should render index page for unknown routes', async () => {
      const res = await request(app).get('/unknown-route');
      expect(res.status).toBe(404);
    });
  });
});
