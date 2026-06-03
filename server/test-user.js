const { User, sequelize } = require('./config/database'); // Wait, config/database doesn't export models.
// I need to require them from models/
const UserMod = require('./models/User');
const { sequelize: seq } = require('./config/database');

const test = async () => {
    try {
        await seq.authenticate();
        console.log('DB Connected');
        await seq.sync({ force: true });
        console.log('DB Synced');
        const u = await UserMod.create({
            name: 'Test',
            email: 'test@test.com',
            password: 'password123'
        });
        console.log('User created:', u.toJSON());
        process.exit(0);
    } catch (err) {
        console.error('FAILED:', err);
        process.exit(1);
    }
};

test();
