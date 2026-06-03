const { Sequelize } = require('sequelize');
const { sequelize } = require('./config/database');
const User = require('./models/User');

async function listUsers() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        const users = await User.findAll();
        console.log(`Found ${users.length} users:`);
        users.forEach(u => {
            console.log(`- ID: ${u.id}, Name: ${u.name}, Email: ${u.email}, Role: ${u.role}`);
        });

    } catch (error) {
        console.error('Unable to connect to the database:', error);
    } finally {
        await sequelize.close();
    }
}

listUsers();
