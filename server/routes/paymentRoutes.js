const express = require('express');
const router = express.Router();
const { Payment, Booking, User } = require('../models');
const { generateId } = require('../utils/idGenerator');

router.get('/', async (req, res) => {
    try {
        const payments = await Payment.findAll({
            order: [['createdAt', 'DESC']]
        });

        // Transform data for frontend
        const formattedPayments = payments.map(p => {
            const payment = p.toJSON();
            // Use denormalized columns if available
            payment.guest = payment.guestDetails || payment.guest || 'Unknown';
            payment.bookingId = payment.bookingRef || payment.bookingId || 'N/A';
            payment.id = payment.transactionId || payment.id;
            return payment;
        });

        res.json(formattedPayments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const paymentData = { ...req.body };
        if (!paymentData.id) paymentData.id = generateId('TXN');
        // date field is handled by createdAt in Sequelize by default, 
        // but if the UI expects a specific 'date' field we should ensure it's in the model or sent.
        const createdPayment = await Payment.create(paymentData);
        res.status(201).json(createdPayment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
