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
const JWT_SECRET = process.env.JWT_SECRET || process.env.SUPABASE_JWT_SECRET;
if (!JWT_SECRET) {
  const error = 'FATAL: JWT_SECRET environment variable is not set. Please configure SUPABASE_JWT_SECRET in Vercel environment variables.';
  console.error(error);
  throw new Error(error);
}

if (JWT_SECRET.length < 32) {
  const error = `FATAL: JWT_SECRET must be at least 32 characters long (current: ${JWT_SECRET.length}). Generate a strong secret with: openssl rand -base64 32`;
  console.error(error);
  throw new Error(error);
}

// Check for weak/default secrets
const WEAK_SECRETS = ['your-secret-key', 'secret', 'default', 'changeme', 'your_super_secret_jwt_key_here_min_32_chars'];
const secretLower = JWT_SECRET.toLowerCase();
if (WEAK_SECRETS.some(weak => secretLower.includes(weak))) {
  const error = 'FATAL: JWT_SECRET appears to be a default/weak secret. Generate a strong secret with: openssl rand -base64 32';
  console.error(error);
  throw new Error(error);
}

// Import database connection
const { sequelize } = require('../server/models');

// Create Express app
const app = express();

// CORS Configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:5173', 'http://localhost:5174'];

console.log('CORS allowed origins:', allowedOrigins);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
            console.log('CORS allowed:', origin);
            callback(null, true);
        } else {
            console.log('CORS blocked:', origin);
            // In production, allow all Vercel preview URLs
            if (process.env.NODE_ENV === 'production' && origin && origin.includes('.vercel.app')) {
                console.log('CORS allowed (Vercel preview):', origin);
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
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
app.use('/auth', require('../server/routes/auth'));
app.use('/users', require('../server/routes/users'));
app.use('/invoices', require('../server/routes/invoices'));
app.use('/pages', require('../server/routes/pages'));
app.use('/integrations', require('../server/routes/integrations'));
app.use('/trips', require('../server/routes/trips'));
app.use('/travel', require('../server/routes/travel'));
app.use('/twilio', require('../server/routes/twilio'));
app.use('/documents', require('../server/routes/documents'));
app.use('/research', require('../server/routes/research'));
app.use('/ai', require('../server/routes/ai'));
app.use('/communication', require('../server/routes/communication'));
app.use('/messages', require('../server/routes/messages'));
app.use('/tasks', require('../server/routes/tasks'));
app.use('/forms', require('../server/routes/forms'));
app.use('/resources', require('../server/routes/resources'));
app.use('/time', require('../server/routes/time'));
app.use('/settings', require('../server/routes/settings'));
app.use('/payments', require('../server/routes/payments'));
app.use('/email', require('../server/routes/email'));
app.use('/video', require('../server/routes/video'));
app.use('/meetings', require('../server/routes/meetings'));
app.use('/calendar', require('../server/routes/calendar'));
app.use('/oauth', require('../server/routes/oauth'));
app.use('/privacy', require('../server/routes/privacy'));
app.use('/nda', require('../server/routes/nda'));
app.use('/onboarding', require('../server/routes/onboarding'));
app.use('/audit-logs', require('../server/routes/auditLogs'));
app.use('/rbac', require('../server/routes/rbac'));
app.use('/va-profiles', require('../server/routes/vaProfiles'));
app.use('/va-matching', require('../server/routes/vaMatching'));
app.use('/setup', require('../server/routes/setup'));

// Health check endpoint
app.get('/health', (req, res) => {
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
app.use('/*', (req, res) => {
    res.status(404).json({ error: 'API endpoint not found' });
});

// Export the Express app as a serverless function
module.exports = app;
