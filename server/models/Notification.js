const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Notification = sequelize.define('Notification', {
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    link: {
        type: DataTypes.STRING
    },
    read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    _id: {
        type: DataTypes.VIRTUAL,
        get() { return String(this.id); }
    }
});

module.exports = Notification;
