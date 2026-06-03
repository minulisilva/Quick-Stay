const express = require('express');
const router = express.Router();
const Award = require('../models/Award');
const { protect, admin } = require('../middleware/authMiddleware');

// Get all visible awards (public)
router.get('/', async (req, res) => {
    try {
        const where = req.query.all === 'true' ? {} : { visible: true };
        const awards = await Award.findAll({
            where,
            order: [['displayOrder', 'ASC'], ['year', 'DESC']]
        });
        res.json(awards);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single award
router.get('/:id', async (req, res) => {
    try {
        const award = await Award.findByPk(req.params.id);
        if (!award) {
            return res.status(404).json({ message: 'Award not found' });
        }
        res.json(award);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create award (admin only)
router.post('/', protect, admin, async (req, res) => {
    try {
        const award = await Award.create(req.body);
        res.status(201).json(award);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update award (admin only)
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const award = await Award.findByPk(req.params.id);
        if (!award) {
            return res.status(404).json({ message: 'Award not found' });
        }
        await award.update(req.body);
        res.json(award);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete award (admin only)
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const award = await Award.findByPk(req.params.id);
        if (!award) {
            return res.status(404).json({ message: 'Award not found' });
        }
        await award.destroy();
        res.json({ message: 'Award deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
