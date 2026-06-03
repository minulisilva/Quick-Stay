const express = require('express');
const router = express.Router();
const Experience = require('../models/Experience');
const { protect, admin } = require('../middleware/authMiddleware');

// Get all experiences (Public)
router.get('/', async (req, res) => {
    try {
        const experiences = await Experience.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json(experiences);
    } catch (error) {
        console.error('Error fetching experiences:', error);
        res.status(500).json({ message: 'Failed to fetch experiences', error: error.message });
    }
});

// Get single experience (Public)
router.get('/:id', async (req, res) => {
    try {
        const experience = await Experience.findByPk(req.params.id);
        if (experience) {
            res.json(experience);
        } else {
            res.status(404).json({ message: 'Experience not found' });
        }
    } catch (error) {
        console.error('Error fetching experience:', error);
        res.status(500).json({ message: 'Failed to fetch experience', error: error.message });
    }
});

// Create experience (Admin only)
router.post('/', protect, admin, async (req, res) => {
    try {
        const experience = await Experience.create(req.body);
        res.status(201).json(experience);
    } catch (error) {
        console.error('Error creating experience:', error);
        res.status(400).json({ message: 'Failed to create experience', error: error.message });
    }
});

// Update experience (Admin only)
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const experience = await Experience.findByPk(req.params.id);
        if (experience) {
            await experience.update(req.body);
            res.json(experience);
        } else {
            res.status(404).json({ message: 'Experience not found' });
        }
    } catch (error) {
        console.error('Error updating experience:', error);
        res.status(400).json({ message: 'Failed to update experience', error: error.message });
    }
});

// Delete experience (Admin only)
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const experience = await Experience.findByPk(req.params.id);
        if (experience) {
            await experience.destroy();
            res.json({ message: 'Experience removed successfully' });
        } else {
            res.status(404).json({ message: 'Experience not found' });
        }
    } catch (error) {
        console.error('Error deleting experience:', error);
        res.status(500).json({ message: 'Failed to delete experience', error: error.message });
    }
});

module.exports = router;
