const express = require('express');
const router = express.Router();
const Staff = require('../models/Staff');
const { protect, admin } = require('../middleware/authMiddleware');

// Get all staff (Public)
router.get('/', async (req, res) => {
    try {
        const staff = await Staff.findAll({
            order: [
                ['order', 'ASC'],
                ['createdAt', 'DESC']
            ]
        });
        res.json(staff);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add Staff (Admin Only)
router.post('/', protect, admin, async (req, res) => {
    try {
        const payload = {
            ...req.body,
            position: req.body.role || req.body.position,
            visible: req.body.displayOnAbout !== undefined ? req.body.displayOnAbout : (req.body.visible !== undefined ? req.body.visible : true)
        };
        const createdStaff = await Staff.create(payload);
        res.status(201).json(createdStaff);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update Staff (Admin Only)
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const staff = await Staff.findByPk(req.params.id);
        if (!staff) return res.status(404).json({ message: 'Staff member not found' });

        const payload = {
            ...req.body,
            position: req.body.role !== undefined ? req.body.role : req.body.position,
            visible: req.body.displayOnAbout !== undefined ? req.body.displayOnAbout : req.body.visible
        };
        await staff.update(payload);
        res.json(staff);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete Staff (Admin Only)
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const staff = await Staff.findByPk(req.params.id);
        if (!staff) return res.status(404).json({ message: 'Staff member not found' });

        await staff.destroy();
        res.json({ message: 'Staff member removed' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
