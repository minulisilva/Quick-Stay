const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validateUserInput } = require('../utils/validation');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const { protect, admin, loginRateLimiter } = require('../middleware/authMiddleware');

// Login User
router.post('/login', loginRateLimiter, async (req, res) => {
    const { email: rawEmail, password } = req.body;
    
    if (!rawEmail || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    
    const email = rawEmail.toLowerCase().trim();
    
    try {
        const user = await User.findOne({ where: { email } });
        if (user && (await user.matchPassword(password))) {
            res.json({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone || '',
                avatar: user.avatar || '',
                dob: user.dob || '',
                address: user.address || '',
                city: user.city || '',
                country: user.country || '',
                dietaryPreferences: user.dietaryPreferences || '',
                specialRequests: user.specialRequests || '',
                token: generateToken(user.id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Login failed. Please try again.' });
    }
});

// Register User
router.post('/register', async (req, res) => {
    try {
        const validation = validateUserInput(req.body);
        
        if (!validation.isValid) {
            return res.status(400).json({ 
                message: 'Validation failed', 
                errors: validation.errors 
            });
        }
        
        const { name, email, password } = req.body;
        const cleanEmail = email.toLowerCase().trim();
        
        const userExists = await User.findOne({ where: { email: cleanEmail } });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }
        
        const user = await User.create({ 
            name: name.trim(), 
            email: cleanEmail, 
            password 
        });
        
        if (user) {
            res.status(201).json({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone || '',
                token: generateToken(user.id),
            });
        }
    } catch (error) {
        console.error('Registration error:', error);
        res.status(400).json({ message: 'Registration failed. Please try again.' });
    }
});

// Get User Profile
router.get('/profile', protect, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (user) {
            res.json({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone || '',
                avatar: user.avatar || '',
                dob: user.dob || '',
                address: user.address || '',
                city: user.city || '',
                country: user.country || '',
                dietaryPreferences: user.dietaryPreferences || '',
                specialRequests: user.specialRequests || ''
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ message: 'Failed to fetch profile' });
    }
});

// Update User Profile
router.put('/profile', protect, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        const validation = validateUserInput(req.body, true);
        if (!validation.isValid) {
            return res.status(400).json({ 
                message: 'Validation failed', 
                errors: validation.errors 
            });
        }
        
        const updates = validation.sanitizedData;
        
        // Update fields
        Object.keys(req.body).forEach(key => {
            if (req.body[key] !== undefined && key !== 'password') {
                user[key] = req.body[key];
            }
        });
        
        if (req.body.password) {
            user.password = req.body.password;
        }
        
        const updatedUser = await user.save();
        
        res.json({
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            phone: updatedUser.phone || '',
            avatar: updatedUser.avatar || '',
            dob: updatedUser.dob || '',
            address: updatedUser.address || '',
            city: updatedUser.city || '',
            country: updatedUser.country || '',
            dietaryPreferences: updatedUser.dietaryPreferences || '',
            specialRequests: updatedUser.specialRequests || '',
            token: generateToken(updatedUser.id),
        });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(400).json({ message: 'Profile update failed' });
    }
});

// Get all users (Admin only)
router.get('/', protect, admin, async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] },
            order: [['createdAt', 'DESC']]
        });
        res.json(users);
    } catch (error) {
        console.error('Users fetch error:', error);
        res.status(500).json({ message: 'Failed to fetch users' });
    }
});

module.exports = router;
