const express = require('express');
const router = express.Router();
const { SystemSetting } = require('../models');
const { authenticateToken, requireRole } = require('../middleware/auth');

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

// Create Setting (Admin Only)
router.post('/', authenticateToken, requireRole('admin'), async (req, res) => {
    try {
        const { key, value } = req.body;
        const [setting, created] = await SystemSetting.findOrCreate({
            where: { key },
            defaults: { value }
        });

        if (!created) {
            return res.status(400).json({ error: 'Setting already exists. Use PUT to update.' });
        }

        res.status(201).json(setting);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update Setting (Admin Only)
router.put('/:key', authenticateToken, requireRole('admin'), async (req, res) => {
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

// Delete Setting (Admin Only)
router.delete('/:key', authenticateToken, requireRole('admin'), async (req, res) => {
    try {
        const setting = await SystemSetting.findByPk(req.params.key);
        if (!setting) return res.status(404).json({ error: 'Setting not found' });

        await setting.destroy();
        res.json({ success: true, message: 'Setting deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
