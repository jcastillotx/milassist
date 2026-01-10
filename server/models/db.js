const { Sequelize } = require('sequelize');
require('dotenv').config();

const dbDialect = process.env.DB_DIALECT || 'sqlite';

let sequelize;

if (dbDialect === 'postgres') {
    // PostgreSQL configuration for production
    sequelize = new Sequelize({
        dialect: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        database: process.env.DB_NAME || 'milassist',
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD,
        logging: process.env.NODE_ENV !== 'production' ? console.log : false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        dialectOptions: {
            // SSL configuration for cloud databases (optional)
            // ssl: process.env.DB_SSL === 'true' ? {
            //     require: true,
            //     rejectUnauthorized: false
            // } : false
        }
    });
} else {
    // SQLite configuration for development
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: process.env.DB_STORAGE || './database.sqlite',
        logging: process.env.NODE_ENV !== 'production' ? console.log : false
    });
}

// Test the connection
sequelize.authenticate()
    .then(() => {
        if (process.env.NODE_ENV !== 'production') {
            console.log(`✅ Database connection established (${dbDialect})`);
        }
    })
    .catch(err => {
        console.error('❌ Unable to connect to the database:', err);
    });

module.exports = { sequelize };
