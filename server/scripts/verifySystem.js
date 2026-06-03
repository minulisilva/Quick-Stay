const { sequelize, connectDB } = require('../config/database');
const {
    User, Room, Booking, DiningOption, DiningReservation,
    Experience, Offer, OfferReservation, Staff, Job,
    Content, Award, Feedback, Payment, Invoice, Message, Notification
} = require('../models');

const verifySystem = async () => {
    try {
        console.log('🔍 Verifying Hotel Management System...\n');
        
        // Test database connection
        await connectDB();
        console.log('✅ Database connection successful');
        
        // Test all models
        const models = [
            { name: 'Users', model: User },
            { name: 'Rooms', model: Room },
            { name: 'Bookings', model: Booking },
            { name: 'DiningOptions', model: DiningOption },
            { name: 'DiningReservations', model: DiningReservation },
            { name: 'Experiences', model: Experience },
            { name: 'Offers', model: Offer },
            { name: 'OfferReservations', model: OfferReservation },
            { name: 'Staff', model: Staff },
            { name: 'Jobs', model: Job },
            { name: 'Content', model: Content },
            { name: 'Awards', model: Award },
            { name: 'Feedback', model: Feedback },
            { name: 'Payments', model: Payment },
            { name: 'Invoices', model: Invoice },
            { name: 'Messages', model: Message },
            { name: 'Notifications', model: Notification }
        ];
        
        console.log('\n📊 Database Tables Status:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        let totalRecords = 0;
        
        for (const { name, model } of models) {
            try {
                const count = await model.count();
                console.log(`   ${name.padEnd(20)} │ ${count.toString().padStart(6)} records`);
                totalRecords += count;
            } catch (error) {
                console.log(`   ${name.padEnd(20)} │ ❌ Error`);
            }
        }
        
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`   ${'Total Records'.padEnd(20)} │ ${totalRecords.toString().padStart(6)}`);
        
        // Verify admin user
        const adminUser = await User.findOne({ where: { role: 'Admin' } });
        if (adminUser) {
            console.log('\n✅ Admin user verified');
            console.log(`   Email: ${adminUser.email}`);
            console.log(`   Name: ${adminUser.name}`);
        } else {
            console.log('\n❌ Admin user not found');
        }
        
        // Verify sample data
        const sampleData = {
            rooms: await Room.count(),
            diningOptions: await DiningOption.count(),
            experiences: await Experience.count(),
            offers: await Offer.count(),
            staff: await Staff.count(),
            jobs: await Job.count(),
            awards: await Award.count()
        };
        
        console.log('\n🎯 Sample Data Verification:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`   Rooms: ${sampleData.rooms} (Expected: 4+)`);
        console.log(`   Dining Options: ${sampleData.diningOptions} (Expected: 3+)`);
        console.log(`   Experiences: ${sampleData.experiences} (Expected: 3+)`);
        console.log(`   Offers: ${sampleData.offers} (Expected: 3+)`);
        console.log(`   Staff: ${sampleData.staff} (Expected: 3+)`);
        console.log(`   Jobs: ${sampleData.jobs} (Expected: 3+)`);
        console.log(`   Awards: ${sampleData.awards} (Expected: 3+)`);
        
        // System health check
        const isHealthy = 
            sampleData.rooms >= 4 &&
            sampleData.diningOptions >= 3 &&
            sampleData.experiences >= 3 &&
            sampleData.offers >= 3 &&
            sampleData.staff >= 3 &&
            sampleData.jobs >= 3 &&
            sampleData.awards >= 3 &&
            adminUser;
        
        console.log('\n🏥 System Health Check:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        if (isHealthy) {
            console.log('✅ System is HEALTHY and ready to use!');
            console.log('\n🚀 Next Steps:');
            console.log('   1. Start the server: npm run dev');
            console.log('   2. Start the client: cd ../client && npm run dev');
            console.log('   3. Start the admin: cd ../admin && npm run dev');
            console.log('\n🌐 Access URLs:');
            console.log('   📊 Admin Panel: http://localhost:5174');
            console.log('   🏨 Client App: http://localhost:5173');
            console.log('   🔧 API Server: http://localhost:3000');
            console.log('\n🔐 Admin Login:');
            console.log('   Email: admin@hotel.com');
            console.log('   Password: admin123');
        } else {
            console.log('❌ System has issues. Please run complete setup again.');
        }
        
        process.exit(0);
        
    } catch (error) {
        console.error('❌ System verification failed:', error);
        process.exit(1);
    }
};

// Run verification if this file is executed directly
if (require.main === module) {
    verifySystem();
}

module.exports = { verifySystem };