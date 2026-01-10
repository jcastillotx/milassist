const express = require('express');
const router = express.Router();
const { PageTemplate } = require('../models');
const { authenticateToken } = require('../middleware/auth');

// Get All Pages (Admin) or Published Pages (Public - logic to add later)
router.get('/', async (req, res) => {
    try {
        const pages = await PageTemplate.findAll();
        res.json(pages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get Page by Slug
router.get('/:slug', async (req, res) => {
    try {
        const page = await PageTemplate.findOne({ where: { slug: req.params.slug } });
        if (!page) return res.status(404).json({ error: 'Page not found' });
        res.json(page);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create/Update Page (Admin Only)
router.post('/', authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    try {
        const { slug, title, content_blocks, is_published } = req.body;

        const [page, created] = await PageTemplate.findOrCreate({
            where: { slug },
            defaults: { title, content_blocks, is_published }
        });

        if (!created) {
            page.title = title;
            page.content_blocks = content_blocks;
            page.is_published = is_published;
            await page.save();
        }

        res.json(page);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
