const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { protect, admin } = require('../middleware/authMiddleware');

// Get all notifications for admin
router.get('/', protect, admin, async (req, res) => {
    try {
        const notifications = await Notification.findAll({
            order: [['createdAt', 'DESC']],
            limit: 20
        });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Mark notification as read
router.put('/:id/read', protect, admin, async (req, res) => {
    try {
        const notification = await Notification.findByPk(req.params.id);
        if (notification) {
            notification.read = true; // Fixed field name to match my Sequelize model
            await notification.save();
            res.json({ message: 'Notification marked as read' });
        } else {
            res.status(404).json({ message: 'Notification not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Mark all as read
router.put('/read-all', protect, admin, async (req, res) => {
    try {
        await Notification.update({ read: true }, { where: { read: false } });
        res.json({ message: 'All notifications marked as read' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete a notification
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const notification = await Notification.findByPk(req.params.id);
        if (notification) {
            await notification.destroy();
            res.json({ message: 'Notification removed' });
        } else {
            res.status(404).json({ message: 'Notification not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
