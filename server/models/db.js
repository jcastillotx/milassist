const { Sequelize } = require('sequelize');
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

// Fail fast if DATABASE_URL is not set in production
if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL && !process.env.POSTGRES_URL) {
    throw new Error('DATABASE_URL or POSTGRES_URL environment variable is required in production');
}

// Use DATABASE_URL or POSTGRES_URL (Vercel provides POSTGRES_URL)
const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;

// PostgreSQL configuration for production
// PostgreSQL configuration for production/development
const isProduction = process.env.NODE_ENV === 'production';

const sequelize = new Sequelize(databaseUrl || 'postgresql://localhost:5432/milassist_dev', {
    dialect: 'postgres',
    logging: isProduction ? false : console.log,
    pool: {
        max: isProduction ? 5 : 10, // Reduce max connections for serverless to prevent exhaustion
        min: 0, // Allow scaling down to 0 to release resources
        acquire: 30000,
        idle: 10000
    },
    dialectOptions: isProduction ? {
        ssl: {
            require: true,
            rejectUnauthorized: false // Critical for Supabase/Vercel connections
        },
        keepAlive: true // Helps prevent ECONNRESET
    } : {}
});

// Test the connection
sequelize.authenticate()
    .then(() => {
        if (process.env.NODE_ENV !== 'production') {
            console.log('✅ Database connection established (PostgreSQL)');
        }
    })
    .catch(err => {
        console.error('❌ Unable to connect to the database:', err);
        if (process.env.NODE_ENV === 'production') {
            throw err; // Fail fast in production
        }
    });

module.exports = { sequelize };
