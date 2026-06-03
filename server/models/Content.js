const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Content = sequelize.define('Content', {
    page: {
        type: DataTypes.STRING,
        allowNull: false
    },
    section: {
        type: DataTypes.STRING,
        allowNull: false
    },
    data: {
        type: DataTypes.JSON,
        allowNull: false
    },
    _id: {
        type: DataTypes.VIRTUAL,
        get() { return String(this.id); }
    }
}, {
    indexes: [
        {
            unique: true,
            fields: ['page', 'section']
        }
    ]
});

module.exports = Content;
