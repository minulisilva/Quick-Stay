const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING
    },
    role: {
        type: DataTypes.ENUM('User', 'Admin', 'Guest', 'Staff'),
        defaultValue: 'User'
    },
    avatar: {
        type: DataTypes.STRING
    },
    dob: {
        type: DataTypes.DATEONLY
    },
    address: {
        type: DataTypes.STRING
    },
    city: {
        type: DataTypes.STRING
    },
    country: {
        type: DataTypes.STRING
    },
    dietaryPreferences: {
        type: DataTypes.TEXT
    },
    specialRequests: {
        type: DataTypes.TEXT
    },
    _id: {
        type: DataTypes.VIRTUAL,
        get() { return String(this.id); }
    }
}, {
    hooks: {
        beforeCreate: async (user) => {
            if (user.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        },
        beforeUpdate: async (user) => {
            if (user.changed('password')) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        }
    }
}, {
    indexes: [
        { fields: ['role'] },
        { fields: ['createdAt'] }
    ]
});

// Instance method for comparing password
User.prototype.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

User.prototype.toJSON = function () {
    const values = { ...this.get() };
    values._id = String(values.id);
    delete values.password;
    return values;
};

module.exports = User;
