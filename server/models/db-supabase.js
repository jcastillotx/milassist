/**
 * Supabase Database Configuration for Legacy Server
 * 
 * This file provides Supabase PostgreSQL connection for the legacy /server directory.
 * Note: The main Payload CMS uses its own database adapter in /payload
 * 
 * Usage:
 *   const { sequelize } = require('./db-supabase');
 */

const { Sequelize } = require('sequelize');
require('dotenv').config();

// Supabase PostgreSQL configuration
const sequelize = new Sequelize(process.env.DATABASE_URI || '', {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false // Required for Supabase
        }
    },
    logging: process.env.NODE_ENV !== 'production' ? console.log : false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

// Test the connection
sequelize.authenticate()
    .then(() => {
        if (process.env.NODE_ENV !== 'production') {
            console.log('✅ Supabase database connection established');
        }
    })
    .catch(err => {
        console.error('❌ Unable to connect to Supabase database:', err.message);
        console.error('💡 Make sure DATABASE_URI is set in .env file');
        console.error('   Format: postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres?sslmode=require');
    });

module.exports = { sequelize };
