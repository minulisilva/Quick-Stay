const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const DiningReservation = require('../models/DiningReservation');
const OfferReservation = require('../models/OfferReservation');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// Get Consolidated Invoice for a User (Admin Only)
router.get('/user/:userId', protect, async (req, res) => {
    if (req.user.role !== 'Admin') {
        return res.status(403).json({ message: 'Not authorized' });
    }

    try {
        const user = await User.findByPk(req.params.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Fetch all related records by email (since IDs might not be linked directly in all legacy data)
        const userEmail = user.email.toLowerCase();

        const bookings = await Booking.findAll({ where: { email: userEmail } });
        const dining = await DiningReservation.findAll({ where: { email: userEmail } });
        const offers = await OfferReservation.findAll({ where: { email: userEmail } });

        const invoiceData = {
            customer: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone
            },
            items: [
                ...bookings.map(b => ({
                    type: 'Room Booking',
                    description: `Room ${b.room} (${new Date(b.checkIn).toLocaleDateString()} - ${new Date(b.checkOut).toLocaleDateString()})`,
                    date: b.createdAt,
                    amount: b.amount,
                    status: b.status,
                    ref: b.id
                })),
                ...dining.map(d => ({
                    type: 'Dining Reservation',
                    description: `${d.restaurant} - ${d.date} @ ${d.time} (${d.guests} guests)`,
                    date: d.createdAt,
                    amount: 0, // Dining reservations are often paid at the venue, usually 0 unless pre-paid
                    status: d.status,
                    ref: d.id
                })),
                ...offers.map(o => ({
                    type: 'Offer Package',
                    description: `${o.offer} Package`,
                    date: o.createdAt,
                    amount: parseFloat(o.amount) || 0,
                    status: o.status,
                    ref: o.id
                }))
            ],
            summary: {
                totalAmount: bookings.reduce((sum, b) => sum + (parseFloat(b.amount) || 0), 0) +
                    offers.reduce((sum, o) => sum + (parseFloat(o.amount) || 0), 0)
            },
            generatedAt: new Date()
        };

        res.json(invoiceData);

    } catch (error) {
        console.error('Invoice Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
