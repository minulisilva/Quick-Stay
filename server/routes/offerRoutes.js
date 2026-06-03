const express = require('express');
const router = express.Router();
const Offer = require('../models/Offer');
const { protect, admin } = require('../middleware/authMiddleware');

// Get all offers
router.get('/', async (req, res) => {
    try {
        const offers = await Offer.findAll();
        res.json(offers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single offer
router.get('/:id', async (req, res) => {
    try {
        const offer = await Offer.findByPk(req.params.id);
        if (offer) {
            res.json(offer);
        } else {
            res.status(404).json({ message: 'Offer not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create offer
router.post('/', protect, async (req, res) => {
    try {
        const offer = await Offer.create(req.body);
        res.status(201).json(offer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update offer
router.put('/:id', protect, async (req, res) => {
    try {
        const offer = await Offer.findByPk(req.params.id);
        if (offer) {
            await offer.update(req.body);
            res.json(offer);
        } else {
            res.status(404).json({ message: 'Offer not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete offer
router.delete('/:id', protect, async (req, res) => {
    try {
        const offer = await Offer.findByPk(req.params.id);
        if (offer) {
            await offer.destroy();
            res.json({ message: 'Offer removed' });
        } else {
            res.status(404).json({ message: 'Offer not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
