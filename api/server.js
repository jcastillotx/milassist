// Vercel Serverless Function wrapper for Express.js backend
const express = require('express');
const cors = require('cors');
const path = require('path');

// Set up environment
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

// Change working directory to server folder for require() to work correctly
process.chdir(path.join(__dirname, '..', 'server'));

// Load environment variables
require('dotenv').config();

// CRITICAL: Validate JWT secret strength before starting server
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET || JWT_SECRET.length < 32) {
  console.error('FATAL: JWT_SECRET must be at least 32 characters long');
  console.error('Generate a strong secret with: openssl rand -base64 32');
  process.exit(1);
}

// Check for weak/default secrets
const WEAK_SECRETS = ['your-secret-key', 'secret', 'default', 'changeme', 'your_super_secret_jwt_key_here_min_32_chars'];
const secretLower = JWT_SECRET.toLowerCase();
if (WEAK_SECRETS.some(weak => secretLower.includes(weak))) {
  console.error('FATAL: JWT_SECRET appears to be a default/weak secret');
  console.error('Generate a strong secret with: openssl rand -base64 32');
  process.exit(1);
}

// Import database connection
const { sequelize } = require('../server/models');

// Create Express app
const app = express();

// CORS Configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:5173', 'http://localhost:5174'];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(express.json());

// Initialize database connection (lazy - only when needed)
let dbInitialized = false;
async function initializeDatabase() {
    if (dbInitialized) return;

    // Fail fast if DATABASE_URL is not set in production
    if (process.env.NODE_ENV === 'production') {
        if (!process.env.DATABASE_URL && !process.env.POSTGRES_URL) {
            throw new Error('DATABASE_URL or POSTGRES_URL environment variable is required in production');
        }
    }

    try {
        await sequelize.authenticate();
        console.log('Database connection established (PostgreSQL).');
        dbInitialized = true;
    } catch (error) {
        console.error('Unable to connect to database:', error);
        if (process.env.NODE_ENV === 'production') {
            throw error; // Fail fast in production
        }
    }
}

// Middleware to ensure DB is initialized
app.use(async (req, res, next) => {
    await initializeDatabase();
    next();
});

// Import all routes
app.use('/api/auth', require('../server/routes/auth'));
app.use('/api/users', require('../server/routes/users'));
app.use('/api/invoices', require('../server/routes/invoices'));
app.use('/api/pages', require('../server/routes/pages'));
app.use('/api/integrations', require('../server/routes/integrations'));
app.use('/api/trips', require('../server/routes/trips'));
app.use('/api/travel', require('../server/routes/travel'));
app.use('/api/twilio', require('../server/routes/twilio'));
app.use('/api/documents', require('../server/routes/documents'));
app.use('/api/research', require('../server/routes/research'));
app.use('/api/ai', require('../server/routes/ai'));
app.use('/api/communication', require('../server/routes/communication'));
app.use('/api/messages', require('../server/routes/messages'));
app.use('/api/tasks', require('../server/routes/tasks'));
app.use('/api/forms', require('../server/routes/forms'));
app.use('/api/resources', require('../server/routes/resources'));
app.use('/api/time', require('../server/routes/time'));
app.use('/api/settings', require('../server/routes/settings'));
app.use('/api/payments', require('../server/routes/payments'));
app.use('/api/email', require('../server/routes/email'));
app.use('/api/video', require('../server/routes/video'));
app.use('/api/meetings', require('../server/routes/meetings'));
app.use('/api/calendar', require('../server/routes/calendar'));
app.use('/api/oauth', require('../server/routes/oauth'));
app.use('/api/privacy', require('../server/routes/privacy'));
app.use('/api/nda', require('../server/routes/nda'));
app.use('/api/onboarding', require('../server/routes/onboarding'));
app.use('/api/audit-logs', require('../server/routes/auditLogs'));
app.use('/api/rbac', require('../server/routes/rbac'));
app.use('/api/va-profiles', require('../server/routes/vaProfiles'));
app.use('/api/va-matching', require('../server/routes/vaMatching'));
app.use('/api/setup', require('../server/routes/setup'));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        environment: process.env.NODE_ENV,
        database: dbInitialized ? 'connected' : 'not initialized',
        timestamp: new Date().toISOString()
    });
});

// Root endpoint
app.get('/api', (req, res) => {
    res.json({
        name: 'MilAssist API',
        version: '2.0.0',
        environment: process.env.NODE_ENV
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: process.env.NODE_ENV === 'production'
            ? 'Internal server error'
            : err.message
    });
});

// 404 handler
app.use('/api/*', (req, res) => {
    res.status(404).json({ error: 'API endpoint not found' });
});

// Export the Express app as a serverless function
module.exports = app;
