// server/models/Booking.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Booking = sequelize.define('Booking', {
    // ✅ PK like "BK-101"
    id: {
        type: DataTypes.STRING(20),
        primaryKey: true,
    },

    bookingNumber: {
        type: DataTypes.STRING(20),
        unique: true,
    },

    guestName: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    phone: {
        type: DataTypes.STRING,
    },

    room: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    checkIn: {
        type: DataTypes.DATE,
        allowNull: false,
    },

    checkOut: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            isAfterCheckIn(value) {
                if (new Date(value) <= new Date(this.checkIn)) {
                    throw new Error('Check-out date must be after check-in date');
                }
            },
        },
    },

    guests: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
    },

    adults: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
    },

    children: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },

    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },

    status: {
        type: DataTypes.STRING,
        defaultValue: 'Confirmed',
    },

    specialRequests: {
        type: DataTypes.TEXT,
    },

    totalPrice: {
        type: DataTypes.VIRTUAL,
        get() {
            return this.amount;
        },
    },

    _id: {
        type: DataTypes.VIRTUAL,
        get() {
            return this.id;
        },
    },
}, {
    tableName: 'bookings',
    timestamps: true,
    indexes: [
        { fields: ['email'] },
        { fields: ['status'] },
        { fields: ['createdAt'] },
    ],
});

module.exports = Booking;
