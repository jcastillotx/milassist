/**
 * Input Validation Middleware
 * Using express-validator for request validation
 */

const { body, param, query, validationResult } = require('express-validator');

// Validation error handler
const validate = (validations) => {
    return async (req, res, next) => {
        await Promise.all(validations.map(validation => validation.run(req)));

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        res.status(400).json({
            error: 'Validation failed',
            details: errors.array().map(err => ({
                field: err.param,
                message: err.msg,
                value: err.value,
            })),
        });
    };
};

// Common validation rules
const validators = {
    // User validation
    register: [
        body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2, max: 100 }),
        body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
        body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
        body('role').isIn(['client', 'assistant', 'admin']).withMessage('Invalid role'),
    ],

    login: [
        body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
        body('password').notEmpty().withMessage('Password is required'),
    ],

    // Task validation
    createTask: [
        body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 255 }),
        body('description').optional().trim().isLength({ max: 5000 }),
        body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
        body('status').optional().isIn(['todo', 'in_progress', 'review', 'done']),
        body('dueDate').optional().isISO8601().withMessage('Invalid date format'),
        body('clientId').optional().isUUID().withMessage('Invalid client ID'),
        body('assistantId').optional().isUUID().withMessage('Invalid assistant ID'),
    ],

    updateTask: [
        param('id').isUUID().withMessage('Invalid task ID'),
        body('title').optional().trim().notEmpty().isLength({ max: 255 }),
        body('description').optional().trim().isLength({ max: 5000 }),
        body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
        body('status').optional().isIn(['todo', 'in_progress', 'review', 'done']),
        body('dueDate').optional().isISO8601(),
        body('assistantId').optional().isUUID(),
    ],

    // Invoice validation
    createInvoice: [
        body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
        body('description').trim().notEmpty().withMessage('Description is required'),
        body('dueDate').optional().isISO8601(),
        body('clientId').isUUID().withMessage('Invalid client ID'),
    ],

    // Time entry validation
    startTimer: [
        body('description').optional().trim().isLength({ max: 500 }),
        body('taskId').optional().isUUID(),
        body('clientId').optional().isUUID(),
    ],

    // Message validation
    sendMessage: [
        body('content').trim().notEmpty().withMessage('Message content is required').isLength({ max: 10000 }),
        body('receiverId').isUUID().withMessage('Invalid receiver ID'),
    ],

    // Payment validation
    createPaymentIntent: [
        body('invoiceId').isUUID().withMessage('Invalid invoice ID'),
        body('amount').isInt({ min: 1 }).withMessage('Amount must be at least 1 cent'),
    ],

    // Document validation
    documentMetadata: [
        body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 255 }),
        body('type').isIn(['contract', 'report', 'presentation', 'other']).withMessage('Invalid document type'),
        body('description').optional().trim().isLength({ max: 1000 }),
    ],

    // UUID param validation
    uuidParam: [
        param('id').isUUID().withMessage('Invalid ID format'),
    ],

    // Pagination validation
    pagination: [
        query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
        query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    ],
};

module.exports = {
    validate,
    validators,
    body,
    param,
    query,
};
