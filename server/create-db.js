const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const createDB = async () => {
    // Connect without database
    const sequelize = new Sequelize('', process.env.DB_USER || 'root', process.env.DB_PASS || '', {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql',
        port: process.env.DB_PORT || 3306,
        logging: console.log
    });

    try {
        await sequelize.authenticate();
        console.log('Connected to MySQL server.');
        await sequelize.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'hotel_management'}\`;`);
        console.log(`Database ${process.env.DB_NAME || 'hotel_management'} created or already exists.`);
        process.exit(0);
    } catch (error) {
        console.error('Error creating database:', error);
        process.exit(1);
    }
};

createDB();
