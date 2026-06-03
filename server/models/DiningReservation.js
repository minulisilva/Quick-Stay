const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const DiningReservation = sequelize.define('DiningReservation', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },

    restaurant: {
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
        type: DataTypes.DATE,
        allowNull: false
    },
    time: {
        type: DataTypes.STRING,
        allowNull: false
    },
    guests: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    specialRequests: {
        type: DataTypes.TEXT
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'Confirmed'
    },

    _id: {
        type: DataTypes.VIRTUAL,
        get() {
            return this.id;
        }
    }
}, {
    tableName: 'diningreservations',
    timestamps: true
});

module.exports = DiningReservation;
