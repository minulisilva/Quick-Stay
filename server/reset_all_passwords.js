const { sequelize } = require('./config/database');
const User = require('./models/User');

async function resetAllPasswords() {
    try {
        await sequelize.authenticate();

        const users = await User.findAll();
        console.log(`Resetting passwords for ${users.length} users to 'password123'...`);

        for (const user of users) {
            // We need to trigger the hook, so we must set the property and save.
            user.password = 'password123';
            await user.save();
            console.log(`- Updated ${user.email} (${user.role})`);
        }

        console.log('All passwords reset successfully.');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
}

resetAllPasswords();
