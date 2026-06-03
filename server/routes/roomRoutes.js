const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const { protect, admin } = require('../middleware/authMiddleware');

// Get all rooms (Public)
router.get('/', async (req, res) => {
    try {
        const rooms = await Room.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json(rooms);
    } catch (error) {
        console.error('Error fetching rooms:', error);
        res.status(500).json({ message: 'Failed to fetch rooms', error: error.message });
    }
});

// Get a single room (Public)
router.get('/:id', async (req, res) => {
    try {
        const room = await Room.findByPk(req.params.id);
        if (room) {
            res.json(room);
        } else {
            res.status(404).json({ message: 'Room not found' });
        }
    } catch (error) {
        console.error('Error fetching room:', error);
        res.status(500).json({ message: 'Failed to fetch room', error: error.message });
    }
});

// Create a room (Admin only)
router.post('/', protect, admin, async (req, res) => {
    try {
        const createdRoom = await Room.create(req.body);
        res.status(201).json(createdRoom);
    } catch (error) {
        console.error('Error creating room:', error);
        res.status(400).json({ message: 'Failed to create room', error: error.message });
    }
});

// Update a room (Admin only)
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const room = await Room.findByPk(req.params.id);
        if (room) {
            await room.update(req.body);
            res.json(room);
        } else {
            res.status(404).json({ message: 'Room not found' });
        }
    } catch (error) {
        console.error('Error updating room:', error);
        res.status(400).json({ message: 'Failed to update room', error: error.message });
    }
});

// Delete a room (Admin only)
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const room = await Room.findByPk(req.params.id);
        if (room) {
            await room.destroy();
            res.json({ message: 'Room removed successfully' });
        } else {
            res.status(404).json({ message: 'Room not found' });
        }
    } catch (error) {
        console.error('Error deleting room:', error);
        res.status(500).json({ message: 'Failed to delete room', error: error.message });
    }
});

module.exports = router;
