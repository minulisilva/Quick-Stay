const { sequelize } = require('./config/database');
const User = require('./models/User');

async function getUser() {
    try {
        await sequelize.authenticate();
        const user = await User.findByPk(4);
        if (user) {
            console.log(`User 4: ${user.email}`);
            console.log(`Name: ${user.name}`);
        } else {
            console.log('User 4 not found');
        }
    } catch (e) { console.error(e); }
    finally { await sequelize.close(); }
}

getUser();
