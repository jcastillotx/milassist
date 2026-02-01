/**
 * Winston Logger Configuration
 * Centralized logging for production
 */

const winston = require('winston');
const path = require('path');

// Define log levels
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};

// Define log colors
const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'blue',
};

winston.addColors(colors);

// Define log format
const format = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
);

// Console format for development
const consoleFormat = winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message}`
    )
);

// Detect serverless environment (Vercel, AWS Lambda, Google Cloud Functions, etc.)
const isServerless = !!(
    process.env.VERCEL ||
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.FUNCTION_NAME ||
    process.env.LAMBDA_TASK_ROOT
);

// Define transports - console always, files only in non-serverless
const transports = [
    // Console for all environments
    new winston.transports.Console({
        format: process.env.NODE_ENV === 'production' ? format : consoleFormat,
    }),
];

// Only add file transports in non-serverless environments
if (!isServerless) {
    transports.push(
        // Error log file
        new winston.transports.File({
            filename: path.join('logs', 'error.log'),
            level: 'error',
            format,
        }),
        // Combined log file
        new winston.transports.File({
            filename: path.join('logs', 'combined.log'),
            format,
        })
    );
}

// Logger configuration
const loggerConfig = {
    level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
    levels,
    format,
    transports,
};

// Only add file-based exception/rejection handlers in non-serverless environments
if (!isServerless) {
    loggerConfig.exceptionHandlers = [
        new winston.transports.File({ filename: path.join('logs', 'exceptions.log') }),
    ];
    loggerConfig.rejectionHandlers = [
        new winston.transports.File({ filename: path.join('logs', 'rejections.log') }),
    ];
}

// Create logger
const logger = winston.createLogger(loggerConfig);

// HTTP request logging middleware
const httpLogger = (req, res, next) => {
    const start = Date.now();
    
    res.on('finish', () => {
        const duration = Date.now() - start;
        const message = `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`;
        
        if (res.statusCode >= 500) {
            logger.error(message);
        } else if (res.statusCode >= 400) {
            logger.warn(message);
        } else {
            logger.http(message);
        }
    });
    
    next();
};

module.exports = {
    logger,
    httpLogger,
};
