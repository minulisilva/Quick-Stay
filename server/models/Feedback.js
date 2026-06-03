const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Feedback = sequelize.define('Feedback', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    guest: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 5
    },
    comment: {
        type: DataTypes.TEXT
    },
    status: {
        type: DataTypes.ENUM('Pending', 'Approved', 'Rejected', 'Hidden'),
        defaultValue: 'Pending'
    },
    department: {
        type: DataTypes.STRING
    },
    _id: {
        type: DataTypes.VIRTUAL,
        get() { return String(this.id); }
    }
}, {
    indexes: [
        { fields: ['status'] },
        { fields: ['department'] },
        { fields: ['createdAt'] }
    ]
});

module.exports = Feedback;
