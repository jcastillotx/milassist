const { Sequelize } = require('sequelize');
require('dotenv').config();

// Fail fast if DATABASE_URL is not set in production
if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL && !process.env.POSTGRES_URL) {
    throw new Error('DATABASE_URL or POSTGRES_URL environment variable is required in production');
}

// Use DATABASE_URL or POSTGRES_URL (Vercel provides POSTGRES_URL)
const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;

// PostgreSQL configuration for production
const sequelize = new Sequelize(databaseUrl || 'postgresql://localhost:5432/milassist_dev', {
    dialect: 'postgres',
    logging: process.env.NODE_ENV !== 'production' ? console.log : false,
    pool: {
        max: 10,
        min: 2,
        acquire: 30000,
        idle: 10000
    },
    dialectOptions: {
        ssl: process.env.NODE_ENV === 'production' ? {
            require: true,
            rejectUnauthorized: false
        } : false
    }
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
