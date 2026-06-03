// server/routes/bookingRoutes.js
const express = require('express');
const router = express.Router();

const Booking = require('../models/Booking');
const { protect } = require('../middleware/authMiddleware');
const { createNotification } = require('../utils/notificationUtils');
const { Op } = require('sequelize');

const { sequelize } = require('../config/database');

// Get all bookings (Secured: Users see only their own, Admins see all)
router.get('/', protect, async (req, res) => {
    try {
        let where = {};

        if (req.user.role !== 'Admin') {
            where.email = req.user.email;
        } else if (req.query.email) {
            where.email = req.query.email;
        }

        if (req.query.room) {
            where.room = req.query.room;
        }

        const bookings = await Booking.findAll({
            where,
            order: [['createdAt', 'DESC']],
        });

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get public availability (busy dates only)
router.get('/availability', async (req, res) => {
    try {
        const where = { status: { [Op.ne]: 'Cancelled' } };

        if (req.query.room) {
            where.room = req.query.room;
        }

        const bookings = await Booking.findAll({
            where,
            attributes: ['checkIn', 'checkOut', 'room', 'status'],
        });

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create Booking (ID like BK-101)
router.post('/', async (req, res) => {
    let t;

    try {
        t = await sequelize.transaction();

        const bookingData = { ...req.body };

        // normalize email
        if (bookingData.email) {
            bookingData.email = bookingData.email.toLowerCase();
        }

        // ✅ Generate next Booking ID like BK-101, BK-102...
        const lastBooking = await Booking.findOne({
            order: [['createdAt', 'DESC']],
            transaction: t,
        });

        let nextNumber = 101;

        if (lastBooking?.id) {
            // lastBooking.id example: "BK-105"
            const parts = String(lastBooking.id).split('-');
            const lastNum = parseInt(parts[1], 10);
            if (!Number.isNaN(lastNum)) nextNumber = lastNum + 1;
        }

        const bookingId = `BK-${nextNumber}`;

        // ✅ IMPORTANT: set the PRIMARY KEY id
        bookingData.id = bookingId;

        // Keep bookingNumber consistent (optional but recommended)
        bookingData.bookingNumber = bookingData.bookingNumber || bookingId;

        const createdBooking = await Booking.create(bookingData, { transaction: t });

        await createNotification(
            {
                type: 'booking',
                title: 'New Room Booking',
                message: `New booking ${createdBooking.bookingNumber} received from ${(createdBooking.guestName || 'Guest').split(' ')[0]
                    }`,
                link: '/admin/bookings',
            },
            { transaction: t }
        );

        await t.commit();
        res.status(201).json(createdBooking);
    } catch (error) {
        if (t) await t.rollback();
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
