const { sequelize, connectDB } = require('../config/database');
const User = require('../models/User');
const { seedContent } = require('./seedContent');
const bcrypt = require('bcryptjs');

const setupDatabase = async () => {
    try {
        console.log('🔄 Setting up database...');
        
        // Connect to database
        await connectDB();
        
        // Sync all models
        await sequelize.sync({ force: false, alter: true });
        console.log('✅ Database models synced successfully');
        
        // Check if admin user exists
        const adminExists = await User.findOne({ where: { role: 'Admin' } });
        
        if (!adminExists) {
            // Create default admin user
            const adminUser = await User.create({
                name: 'Admin User',
                email: 'admin@hotel.com',
                password: 'admin123', // Will be hashed by the model hook
                role: 'Admin',
                phone: '+1234567890'
            });
            
            console.log('✅ Default admin user created:');
            console.log('   Email: admin@hotel.com');
            console.log('   Password: admin123');
            console.log('   ⚠️  Please change the password after first login!');
        } else {
            console.log('ℹ️  Admin user already exists');
        }
        
        // Seed content for CMS
        await seedContent();
        
        console.log('🎉 Database setup completed successfully!');
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Database setup failed:', error);
        process.exit(1);
    }
};

// Run setup if this file is executed directly
if (require.main === module) {
    setupDatabase();
}

module.exports = { setupDatabase };