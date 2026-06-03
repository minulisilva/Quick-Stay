const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const JobApplication = sequelize.define('JobApplication', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING
    },
    resume: {
        type: DataTypes.STRING
    },
    coverLetter: {
        type: DataTypes.TEXT
    },
    portfolio: {
        type: DataTypes.STRING
    },
    jobId: {
        type: DataTypes.INTEGER
    },
    status: {
        type: DataTypes.ENUM('Pending', 'Reviewed', 'Interview', 'Rejected', 'Hired'),
        defaultValue: 'Pending'
    },
    _id: {
        type: DataTypes.VIRTUAL,
        get() { return String(this.id); }
    }
});

module.exports = JobApplication;
