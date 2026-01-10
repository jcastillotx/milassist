const express = require('express');
const router = express.Router();
const { User, SystemSetting, sequelize } = require('../models');
const bcrypt = require('bcryptjs');

// Check if system is already initialized
const checkInitialized = async () => {
    const adminCount = await User.count({ where: { role: 'admin' } });
    return adminCount > 0;
};

// Middleware to block setup if already initialized
const setupLock = async (req, res, next) => {
    const initialized = await checkInitialized();
    if (initialized) {
        return res.status(403).json({ error: 'System already initialized' });
    }
    next();
};

// GET /setup/status - Check setup status
router.get('/status', async (req, res) => {
    try {
        const initialized = await checkInitialized();
        res.json({ initialized });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /setup/init - Initialize system with admin and settings
router.post('/init', setupLock, async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { admin, settings } = req.body;

        // 1. Create Admin User
        const hashedPassword = await bcrypt.hash(admin.password, 10);
        const user = await User.create({
            name: admin.name,
            email: admin.email,
            password: hashedPassword,
            role: 'admin',
            verificationStatus: 'verified'
        }, { transaction: t });

        // 2. Save System Settings
        if (settings) {
            for (const [key, value] of Object.entries(settings)) {
                await SystemSetting.create({
                    key,
                    value: JSON.stringify(value)
                }, { transaction: t });
            }
        }

        await t.commit();
        res.json({ message: 'System initialized successfully', admin: { id: user.id, email: user.email } });
    } catch (error) {
        await t.rollback();
        console.error('Setup initialization error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
