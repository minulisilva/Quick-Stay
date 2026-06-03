const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Job = sequelize.define('Job', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    department: {
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.TEXT
    },
    requirements: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    location: {
        type: DataTypes.STRING
    },
    type: {
        type: DataTypes.ENUM('Full-time', 'Part-time', 'Contract'),
        defaultValue: 'Full-time'
    },
    status: {
        type: DataTypes.ENUM('Active', 'Inactive'),
        defaultValue: 'Active'
    },
    _id: {
        type: DataTypes.VIRTUAL,
        get() { return String(this.id); }
    }
}, {
    indexes: [
        { fields: ['status'] },
        { fields: ['createdAt'] }
    ]
});

Job.prototype.toJSON = function () {
    const values = { ...this.get() };
    values._id = String(values.id);
    values.active = values.status === 'Active';
    return values;
};

module.exports = Job;
