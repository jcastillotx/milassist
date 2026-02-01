import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Vercel Serverless Function wrapper for Express.js backend
const express = require('express');
const cors = require('cors');

// Set up environment
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

// Add root node_modules to NODE_PATH so server code can find dependencies
const rootNodeModules = path.join(__dirname, '..', 'node_modules');
process.env.NODE_PATH = process.env.NODE_PATH
  ? `${process.env.NODE_PATH}:${rootNodeModules}`
  : rootNodeModules;
require('module').Module._initPaths();

// Load environment variables from server directory
require('dotenv').config({ path: path.join(__dirname, '..', 'server', '.env') });

// CRITICAL: Validate JWT secret strength before starting server
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  const error = 'FATAL: JWT_SECRET environment variable is not set. Please configure JWT_SECRET in Vercel environment variables (separate from SUPABASE_JWT_SECRET).';
  console.error(error);
  throw new Error(error);
}

if (JWT_SECRET.length < 32) {
  const error = `FATAL: JWT_SECRET must be at least 32 characters long (current: ${JWT_SECRET.length}).

IMPORTANT: JWT_SECRET and SUPABASE_JWT_SECRET are different:
- JWT_SECRET: Used for your app's authentication tokens (needs 32+ chars)
- SUPABASE_JWT_SECRET: Used by Supabase internally (can be shorter)

Generate a secure JWT_SECRET with: openssl rand -base64 32

Then add it to Vercel environment variables at:
https://vercel.com/your-project/settings/environment-variables`;
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

// Pre-load pg from root node_modules before server code requires it
// This ensures Sequelize can find it when initializing
try {
  require('pg');
  require('pg-hstore');
  console.log('✓ Pre-loaded pg and pg-hstore from root node_modules');
} catch (e) {
  console.error('Failed to pre-load pg packages:', e.message);
  throw e;
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
// Create a router for all /api prefixed requests
const apiRouter = express.Router();

// Define all routes on the apiRouter
apiRouter.use('/auth', require('../server/routes/auth'));
apiRouter.use('/users', require('../server/routes/users'));
apiRouter.use('/invoices', require('../server/routes/invoices'));
apiRouter.use('/pages', require('../server/routes/pages'));
apiRouter.use('/integrations', require('../server/routes/integrations'));
apiRouter.use('/trips', require('../server/routes/trips'));
apiRouter.use('/travel', require('../server/routes/travel'));
apiRouter.use('/twilio', require('../server/routes/twilio'));
apiRouter.use('/documents', require('../server/routes/documents'));
apiRouter.use('/research', require('../server/routes/research'));
apiRouter.use('/ai', require('../server/routes/ai'));
apiRouter.use('/communication', require('../server/routes/communication'));
apiRouter.use('/messages', require('../server/routes/messages'));
apiRouter.use('/tasks', require('../server/routes/tasks'));
apiRouter.use('/forms', require('../server/routes/forms'));
apiRouter.use('/resources', require('../server/routes/resources'));
apiRouter.use('/time', require('../server/routes/time'));
apiRouter.use('/settings', require('../server/routes/settings'));
apiRouter.use('/payments', require('../server/routes/payments'));
apiRouter.use('/email', require('../server/routes/email'));
apiRouter.use('/video', require('../server/routes/video'));
apiRouter.use('/meetings', require('../server/routes/meetings'));
apiRouter.use('/calendar', require('../server/routes/calendar'));
// apiRouter.use('/oauth', require('../server/routes/oauth'));
apiRouter.use('/privacy', require('../server/routes/privacy'));
// apiRouter.use('/nda', require('../server/routes/nda'));
// apiRouter.use('/onboarding', require('../server/routes/onboarding'));
apiRouter.use('/audit-logs', require('../server/routes/auditLogs'));
apiRouter.use('/rbac', require('../server/routes/rbac'));
apiRouter.use('/va-profiles', require('../server/routes/vaProfiles'));
apiRouter.use('/va-matching', require('../server/routes/vaMatching'));
apiRouter.use('/setup', require('../server/routes/setup'));

// Health check endpoint
apiRouter.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        environment: process.env.NODE_ENV,
        database: dbInitialized ? 'connected' : 'not initialized',
        timestamp: new Date().toISOString()
    });
});

// Root endpoint for the router (matches /api)
apiRouter.get('/', (req, res) => {
    res.json({
        name: 'MilAssist API',
        version: '2.0.0',
        environment: process.env.NODE_ENV
    });
});

// Mount the apiRouter at the /api root
app.use('/api', apiRouter);

// Fallback top-level health check (for legacy tools/scripts)
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        environment: process.env.NODE_ENV,
        database: dbInitialized ? 'connected' : 'not initialized',
        timestamp: new Date().toISOString()
    });
});

// Root endpoint legacy
app.get('/', (req, res) => {
    res.send('MilAssist API is running');
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
export default app;
