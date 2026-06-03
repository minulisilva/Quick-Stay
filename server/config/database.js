const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS || '',
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        port: process.env.DB_PORT || 3306,
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        define: {
            timestamps: true
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        retry: {
            match: [
                /ETIMEDOUT/,
                /EHOSTUNREACH/,
                /ECONNRESET/,
                /ECONNREFUSED/,
                /ETIMEDOUT/,
                /ESOCKETTIMEDOUT/,
                /EHOSTUNREACH/,
                /EPIPE/,
                /EAI_AGAIN/,
                /ER_LOCK_WAIT_TIMEOUT/,
                /ER_LOCK_DEADLOCK/
            ],
            max: 3
        }
    }
);

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ MySQL Connected successfully with Sequelize.');
        
        // Test the connection
        const [results] = await sequelize.query('SELECT 1 + 1 AS result');
        console.log('📊 Database test query successful:', results[0].result);
        
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error.message);
        console.error('Please ensure MySQL is running and credentials are correct.');
        throw error;
    }
};

module.exports = { sequelize, connectDB };
