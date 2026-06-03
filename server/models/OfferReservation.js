const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const OfferReservation = sequelize.define('OfferReservation', {
    offer: {
        type: DataTypes.STRING
    },
    guestName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING
    },
    date: {
        type: DataTypes.DATE
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2)
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'Confirmed'
    },
    _id: {
        type: DataTypes.VIRTUAL,
        get() { return String(this.id); }
    }
});

module.exports = OfferReservation;
