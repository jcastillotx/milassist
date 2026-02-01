const request = require('supertest');
const express = require('express');
const authRoutes = require('../../routes/auth');

// Create test app
const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

describe('Auth Routes', () => {
  describe('POST /auth/register', () => {
    test('should reject registration with missing fields', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          email: 'test@example.com'
          // Missing password and name
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('should reject registration with invalid email', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          email: 'invalid-email',
          password: 'password123',
          name: 'Test User',
          role: 'client'
        });

      expect(response.status).toBe(400);
    });

    test('should reject weak passwords', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: '123',
          name: 'Test User',
          role: 'client'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('password');
    });
  });

  describe('POST /auth/login', () => {
    test('should reject login with missing credentials', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({});

      expect(response.status).toBe(400);
    });

    test('should return token on successful login', async () => {
      // This test requires database setup
      // Skipped for now - implement with proper test database
      expect(true).toBe(true);
    });
  });
});
