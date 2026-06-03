const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            
            if (!token) {
                return res.status(401).json({ message: 'Not authorized, no token provided' });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findByPk(decoded.id, {
                attributes: { exclude: ['password'] }
            });

            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            next();
        } catch (error) {
            console.error('Auth middleware error:', error.message);
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: 'Not authorized, invalid token' });
            } else if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Not authorized, token expired' });
            }
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        return res.status(401).json({ message: 'Not authorized, no token provided' });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'Admin') {
        return next();
    } else {
        return res.status(403).json({ message: 'Access denied: Admin privileges required' });
    }
};

// Enhanced Rate Limiter for Login
const loginAttempts = new Map();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

const loginRateLimiter = (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
    const now = Date.now();

    if (!loginAttempts.has(ip)) {
        loginAttempts.set(ip, { count: 1, firstAttempt: now });
        return next();
    }

    const attempts = loginAttempts.get(ip);
    
    // Reset if window has passed
    if (now - attempts.firstAttempt > RATE_LIMIT_WINDOW) {
        loginAttempts.set(ip, { count: 1, firstAttempt: now });
        return next();
    }

    if (attempts.count >= MAX_ATTEMPTS) {
        const timeLeft = Math.ceil((RATE_LIMIT_WINDOW - (now - attempts.firstAttempt)) / 60000);
        return res.status(429).json({
            message: `Too many login attempts. Please try again in ${timeLeft} minutes.`
        });
    }

    attempts.count += 1;
    loginAttempts.set(ip, attempts);
    next();
};

// Clean up old entries periodically
setInterval(() => {
    const now = Date.now();
    for (const [ip, data] of loginAttempts.entries()) {
        if (now - data.firstAttempt > RATE_LIMIT_WINDOW) {
            loginAttempts.delete(ip);
        }
    }
}, RATE_LIMIT_WINDOW);

module.exports = { protect, admin, loginRateLimiter };
