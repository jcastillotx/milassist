const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { User, Skill } = require('../models');
const { secretKey, jwtExpiration } = require('../middleware/auth');
const AuditLogService = require('../services/auditLog');

// Rate limiter for authentication endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: 'Too many authentication attempts, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

// REGISTER
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password_hash: hashedPassword,
            role
        });

        // Log user registration
        await AuditLogService.log({
            eventType: AuditLogService.EVENT_TYPES.USER_REGISTERED,
            userId: user.id,
            ipAddress: req.ip,
            userAgent: req.get('user-agent'),
            details: {
                email: user.email,
                role: user.role
            }
        });

        res.status(201).json({ message: 'User created successfully', userId: user.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// LOGIN
router.post('/login', authLimiter, async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) {
            // Log failed login attempt
            await AuditLogService.log({
                eventType: AuditLogService.EVENT_TYPES.LOGIN_FAILED,
                severity: 'medium',
                ipAddress: req.ip,
                userAgent: req.get('user-agent'),
                details: {
                    email,
                    reason: 'User not found'
                }
            });
            return res.status(400).json({ error: 'User not found' });
        }

        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            // Log failed login attempt
            await AuditLogService.log({
                eventType: AuditLogService.EVENT_TYPES.LOGIN_FAILED,
                severity: 'medium',
                userId: user.id,
                ipAddress: req.ip,
                userAgent: req.get('user-agent'),
                details: {
                    email,
                    reason: 'Invalid password'
                }
            });
            return res.status(400).json({ error: 'Invalid password' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, secretKey, { expiresIn: jwtExpiration });
        
        // Log successful login
        await AuditLogService.log({
            eventType: AuditLogService.EVENT_TYPES.LOGIN_SUCCESS,
            userId: user.id,
            ipAddress: req.ip,
            userAgent: req.get('user-agent'),
            details: {
                email: user.email
            }
        });

        res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
