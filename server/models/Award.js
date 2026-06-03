const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Award = sequelize.define('Award', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    organization: {
        type: DataTypes.STRING,
        allowNull: false
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.TEXT
    },
    image: {
        type: DataTypes.STRING
    },
    displayOrder: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    visible: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    _id: {
        type: DataTypes.VIRTUAL,
        get() { return String(this.id); }
    }
}, {
    indexes: [
        { fields: ['displayOrder'] },
        { fields: ['visible'] }
    ]
});

Award.prototype.toJSON = function () {
    const values = { ...this.get() };
    values._id = String(values.id);
    return values;
};

module.exports = Award;
