const { sequelize } = require('./config/database');
const User = require('./models/User');

async function resetAdmin() {
    try {
        await sequelize.authenticate();

        const email = 'admin@quickstay.com';
        const plainPassword = 'admin123';

        let admin = await User.findOne({ where: { email } });

        if (!admin) {
            admin = await User.create({
                name: 'System Admin',
                email,
                password: plainPassword,  // ✅ hook will hash if your model has it
                role: 'Admin'
            });
        } else {
            admin.password = plainPassword; // ✅ hook will hash
            admin.role = 'Admin';
            await admin.save();
        }

        console.log('✅ Admin ready:', email, plainPassword);
    } catch (err) {
        console.error('❌ Error:', err);
    } finally {
        await sequelize.close();
    }
}

resetAdmin();
