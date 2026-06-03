const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Staff = sequelize.define('Staff', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    position: {
        type: DataTypes.STRING
    },
    role: {
        type: DataTypes.VIRTUAL,
        get() { return this.position; },
        set(value) { this.setDataValue('position', value); }
    },
    bio: {
        type: DataTypes.TEXT
    },
    image: {
        type: DataTypes.STRING
    },
    department: {
        type: DataTypes.STRING
    },
    socials: {
        type: DataTypes.JSON,
        defaultValue: {}
    },
    visible: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    displayOnAbout: {
        type: DataTypes.VIRTUAL,
        get() { return this.visible; },
        set(value) { this.setDataValue('visible', value); }
    },
    order: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    _id: {
        type: DataTypes.VIRTUAL,
        get() { return String(this.id); }
    }
});

Staff.prototype.toJSON = function () {
    const values = { ...this.get() };
    values._id = String(values.id);
    return values;
};

module.exports = Staff;
