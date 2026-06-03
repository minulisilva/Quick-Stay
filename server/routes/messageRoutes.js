const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { generateId } = require('../utils/idGenerator');
const { createNotification } = require('../utils/notificationUtils');

// GET all messages (Admin with Pagination)
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { count, rows } = await Message.findAndCountAll({
            order: [['createdAt', 'DESC']],
            limit,
            offset
        });

        res.json({
            messages: rows,
            total: count,
            pages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST new message (Public)
router.post('/', async (req, res) => {
    try {
        const messageData = { ...req.body };
        // The model doesn't have a custom 'id' or 'date' field from my migration, 
        // but I'll add them if they were in the original Mongoose schema or just ignore them if they are not in the Sequelize model.
        // Based on viewed Message.js, it's name, email, subject, message, read.
        const createdMessage = await Message.create(messageData);

        // Create Admin Notification
        await createNotification({
            type: 'message',
            title: 'New Inquiry',
            message: `New message from ${createdMessage.name}: ${createdMessage.subject}`,
            link: '/admin/messages'
        });

        res.status(201).json(createdMessage);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PATCH update status (Admin)
router.patch('/:id', async (req, res) => {
    try {
        const message = await Message.findByPk(req.params.id);
        if (message) {
            if (req.body.status !== undefined) message.status = req.body.status;

            const updated = await message.save();
            res.json(updated);
        } else {
            res.status(404).json({ message: 'Message not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE message (Admin)
router.delete('/:id', async (req, res) => {
    try {
        const message = await Message.findByPk(req.params.id);
        if (!message) return res.status(404).json({ message: 'Message not found' });
        await message.destroy();
        res.json({ message: 'Message deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
