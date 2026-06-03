const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Room = sequelize.define('Room', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    shortDescription: {
        type: DataTypes.TEXT
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    size: {
        type: DataTypes.INTEGER
    },
    occupancy: {
        type: DataTypes.JSON,
        defaultValue: { adults: 2, children: 0 }
    },
    bedType: {
        type: DataTypes.STRING
    },
    view: {
        type: DataTypes.STRING
    },
    image: {
        type: DataTypes.STRING
    },
    gallery: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    amenities: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    featured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    isAvailable: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    _id: {
        type: DataTypes.VIRTUAL,
        get() { return String(this.id); }
    },
    images: {
        type: DataTypes.VIRTUAL,
        get() { return this.gallery; },
        set(val) { this.setDataValue('gallery', val); }
    }
});

module.exports = Room;
