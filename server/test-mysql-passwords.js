const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const passwords = ['', 'root', 'password', '1234', '123456', 'admin'];

const testPasswords = async () => {
    for (const pass of passwords) {
        console.log(`Testing password: "${pass}"`);
        const sequelize = new Sequelize('', process.env.DB_USER || 'root', pass, {
            host: process.env.DB_HOST || '127.0.0.1',
            dialect: 'mysql',
            port: process.env.DB_PORT || 3306,
            logging: false,
            retry: { max: 0 }
        });

        try {
            await sequelize.authenticate();
            console.log(`SUCCESS! Password is: "${pass}"`);
            process.exit(0);
        } catch (error) {
            console.log(`Failed with password: "${pass}"`);
        }
    }
    console.log('Tested all passwords. None worked.');
    process.exit(1);
};

testPasswords();
