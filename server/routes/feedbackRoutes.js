const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const { createNotification } = require('../utils/notificationUtils');
const { generateId } = require('../utils/idGenerator');

const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', async (req, res) => {
    try {
        const { status, department } = req.query;

        let where = {};

        // Public users can only see Approved feedbacks
        // Admin users (with pagination params) can see all with filters
        const isAdminQuery = req.query.page || req.query.limit;

        if (!isAdminQuery) {
            // Public query - only approved feedbacks, no pagination
            where.status = 'Approved';
            const feedbacks = await Feedback.findAll({
                where,
                order: [['createdAt', 'DESC']],
                limit: 50 // Reasonable limit for public display
            });
            return res.json(feedbacks);
        }

        // Admin query with pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        if (status && status !== 'All') {
            where.status = status;
        }
        if (department && department !== 'All') {
            where.department = department;
        }

        const { count, rows } = await Feedback.findAndCountAll({
            where,
            order: [['createdAt', 'DESC']],
            limit,
            offset
        });

        res.json({
            feedbacks: rows,
            total: count,
            pages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const feedbackData = { ...req.body };
        if (!feedbackData.id) {
            feedbackData.id = generateId('REV');
        }
        const createdFeedback = await Feedback.create(feedbackData);

        // Create Admin Notification
        await createNotification({
            type: 'feedback',
            title: 'New Guest Review',
            message: `${createdFeedback.guest} left a ${createdFeedback.rating}-star review`,
            link: '/admin/feedback'
        });

        res.status(201).json(createdFeedback);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update feedback (Status, Reply, etc.)
router.patch('/:id', protect, async (req, res) => {
    try {
        const feedback = await Feedback.findByPk(req.params.id);
        if (!feedback) return res.status(404).json({ message: 'Feedback not found' });

        await feedback.update(req.body);
        res.json(feedback);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete feedback
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const feedback = await Feedback.findByPk(req.params.id);
        if (!feedback) return res.status(404).json({ message: 'Feedback not found' });

        await feedback.destroy();
        res.json({ message: 'Feedback deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
