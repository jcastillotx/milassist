const express = require('express');
const router = express.Router();
const { SystemSetting } = require('../models');
const { authenticateToken } = require('../middleware/auth');

// Get Setting by Key
router.get('/:key', async (req, res) => {
    try {
        const setting = await SystemSetting.findByPk(req.params.key);
        if (!setting) return res.status(404).json({ error: 'Setting not found' });
        res.json(setting);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update Setting (Admin Only)
router.put('/:key', authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);

    try {
        const [setting, created] = await SystemSetting.findOrCreate({
            where: { key: req.params.key },
            defaults: { value: req.body.value }
        });

        if (!created) {
            setting.value = req.body.value;
            await setting.save();
        }

        res.json(setting);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
