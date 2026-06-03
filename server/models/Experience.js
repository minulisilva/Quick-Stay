const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Experience = sequelize.define('Experience', {
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
        type: DataTypes.DECIMAL(10, 2)
    },
    duration: {
        type: DataTypes.STRING
    },
    category: {
        type: DataTypes.STRING
    },
    image: {
        type: DataTypes.STRING
    },
    subtitle: {
        type: DataTypes.STRING
    },
    features: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    inclusions: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    images: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    _id: {
        type: DataTypes.VIRTUAL,
        get() { return String(this.id); }
    }
});

Experience.prototype.toJSON = function () {
    const values = { ...this.get() };
    values._id = String(values.id);
    if (!values.features) values.features = [];
    if (!values.inclusions) values.inclusions = [];
    return values;
};

module.exports = Experience;
