const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const DiningOption = sequelize.define('DiningOption', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    image: {
        type: DataTypes.STRING
    },
    images: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    cuisine: {
        type: DataTypes.STRING
    },
    features: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    openingHours: {
        type: DataTypes.STRING
    },
    location: {
        type: DataTypes.STRING
    },
    _id: {
        type: DataTypes.VIRTUAL,
        get() { return String(this.id); }
    }
}, {
    tableName: 'diningoptions',
    timestamps: true
});

DiningOption.prototype.toJSON = function () {
    const values = { ...this.get() };
    values._id = String(values.id);
    return values;
};

module.exports = DiningOption;
