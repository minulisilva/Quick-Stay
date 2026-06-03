const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Offer = sequelize.define('Offer', {
    id_custom: {
        type: DataTypes.INTEGER,
        unique: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    desc: {
        type: DataTypes.TEXT
    },
    description: {
        type: DataTypes.TEXT
    },
    price: {
        type: DataTypes.STRING
    },
    inclusions: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    discountPercentage: {
        type: DataTypes.INTEGER
    },
    validUntil: {
        type: DataTypes.DATE
    },
    img: {
        type: DataTypes.STRING
    },
    image: {
        type: DataTypes.STRING
    },
    _id: {
        type: DataTypes.VIRTUAL,
        get() { return String(this.id); }
    }
});

module.exports = Offer;
