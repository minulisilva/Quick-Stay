const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');

const DiningReservation = require('../models/DiningReservation');

// ✅ GET user's dining reservations (authenticated users)
router.get('/', protect, async (req, res) => {
    try {
        const reservations = await DiningReservation.findAll({
            where: { email: req.user.email },
            order: [['createdAt', 'DESC']],
        });
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ✅ GET all dining reservations (for admin only)
router.get('/admin', protect, admin, async (req, res) => {
    try {
        const reservations = await DiningReservation.findAll({
            order: [['createdAt', 'DESC']],
        });
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ✅ POST create reservation (ID like RES-101)
router.post('/', async (req, res) => {
    try {
        const lastReservation = await DiningReservation.findOne({
            order: [['createdAt', 'DESC']],
        });

        let nextNumber = 101;

        if (lastReservation?.id) {
            const parts = String(lastReservation.id).split('-'); // "RES-105"
            const lastNum = parseInt(parts[1], 10);
            if (!Number.isNaN(lastNum)) nextNumber = lastNum + 1;
        }

        const reservationId = `RES-${nextNumber}`;

        const reservation = await DiningReservation.create({
            id: reservationId,
            ...req.body,
            email: req.body.email ? req.body.email.toLowerCase() : req.body.email,
        });

        res.status(201).json(reservation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
