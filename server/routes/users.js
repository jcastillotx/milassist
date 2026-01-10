const express = require('express');
const router = express.Router();
const { User, Skill } = require('../models');
const { authenticateToken } = require('../middleware/auth');

// Get My Profile
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            include: { model: Skill, as: 'skills' },
            attributes: { exclude: ['password_hash'] }
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Find Assistants (Public user search)
router.get('/assistants', async (req, res) => {
    try {
        const { skill } = req.query;
        const includeOptions = {
            model: Skill,
            as: 'skills'
        };

        // Filter by skill if provided
        if (skill) {
            includeOptions.where = { name: skill };
        }

        const assistants = await User.findAll({
            where: { role: 'assistant' },
            include: includeOptions,
            attributes: { exclude: ['password_hash'] }
        });
        res.json(assistants);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add Skill (Assistant only)
router.post('/skills', authenticateToken, async (req, res) => {
    if (req.user.role !== 'assistant') return res.sendStatus(403);
    try {
        const { skillName, category } = req.body;
        let [skill] = await Skill.findOrCreate({
            where: { name: skillName },
            defaults: { category }
        });

        const user = await User.findByPk(req.user.id);
        await user.addSkill(skill);

        res.json({ message: 'Skill added', skill });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
});

// Update Profile / Onboarding
router.post('/onboarding', authenticateToken, async (req, res) => {
    try {
        const { bio, location, verificationData, phone } = req.body;
        const user = await User.findByPk(req.user.id);

        const updatedProfile = {
            ...user.profile_data,
            bio,
            location,
            phone,
            verificationStatus: verificationData, // { verified: true, date: ... }
            onboardingCompleted: true
        };

        user.profile_data = updatedProfile;
        await user.save();

        res.json({ message: 'Profile updated', user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
