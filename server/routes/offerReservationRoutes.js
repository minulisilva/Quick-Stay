const express = require('express');
const router = express.Router();
const OfferReservation = require('../models/OfferReservation');
const { protect } = require('../middleware/authMiddleware');
const { Op } = require('sequelize');
const { generateId } = require('../utils/idGenerator');

router.get('/', protect, async (req, res) => {
    try {
        let where = {};
        if (req.user.role !== 'Admin') {
            where.email = req.user.email;
        }
        const reservations = await OfferReservation.findAll({
            where,
            order: [['createdAt', 'DESC']]
        });
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const resData = { ...req.body };
        // Remove custom ID generation - let database auto-increment
        delete resData.id;
        const createdReservation = await OfferReservation.create(resData);
        res.status(201).json(createdReservation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update Status
router.patch('/:id', protect, async (req, res) => {
    try {
        const where = isNaN(req.params.id)
            ? { id: req.params.id }
            : { [Op.or]: [{ id: req.params.id }, { id: parseInt(req.params.id) }] };

        const reservation = await OfferReservation.findOne({ where });

        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        reservation.status = req.body.status || reservation.status;
        const updatedReservation = await reservation.save();
        res.json(updatedReservation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
