const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Invoice = sequelize.define('Invoice', {
    guestName: {
        type: DataTypes.STRING
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2)
    },
    items: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'Unpaid'
    },
    dueDate: {
        type: DataTypes.DATE
    },
    _id: {
        type: DataTypes.VIRTUAL,
        get() { return String(this.id); }
    }
});

module.exports = Invoice;
