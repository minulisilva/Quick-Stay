// server/models/Payment.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Payment = sequelize.define('Payment', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },

    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },

    method: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    status: {
        type: DataTypes.STRING,
        defaultValue: 'Pending',
    },

    transactionId: {
        type: DataTypes.STRING,
    },

    // ✅ MUST match Booking.id type (BK-101)
    bookingId: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },

    guestDetails: {
        type: DataTypes.STRING,
    },

    bookingRef: {
        type: DataTypes.STRING,
    },

    _id: {
        type: DataTypes.VIRTUAL,
        get() {
            return String(this.id);
        },
    },
}, {
    tableName: 'payments',
    timestamps: true,
});

module.exports = Payment;
