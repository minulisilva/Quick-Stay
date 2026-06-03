const express = require('express');
const router = express.Router();
const DiningOption = require('../models/DiningOption');
const { protect, admin } = require('../middleware/authMiddleware');

// Get all dining options
router.get('/', async (req, res) => {
    try {
        const diningOptions = await DiningOption.findAll();
        res.json(diningOptions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create dining option
router.post('/', protect, admin, async (req, res) => {
    try {
        const diningOption = await DiningOption.create(req.body);
        res.status(201).json(diningOption);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update dining option
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const diningOption = await DiningOption.findByPk(req.params.id);
        if (diningOption) {
            await diningOption.update(req.body);
            res.json(diningOption);
        } else {
            res.status(404).json({ message: 'Dining option not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete dining option
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const diningOption = await DiningOption.findByPk(req.params.id);
        if (diningOption) {
            await diningOption.destroy();
            res.json({ message: 'Dining option removed' });
        } else {
            res.status(404).json({ message: 'Dining option not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
