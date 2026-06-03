const { sequelize } = require('../config/database');
const Offer = require('../models/Offer');

const sampleOffers = [
    {
        title: 'Weekend Getaway Special',
        description: 'Escape the city and enjoy a relaxing weekend with us. Includes complimentary breakfast, spa access, and late checkout.',
        discount: 25,
        validFrom: new Date('2024-01-01'),
        validTo: new Date('2024-12-31'),
        terms: 'Valid for weekend stays only. Minimum 2 nights required. Cannot be combined with other offers.',
        image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d',
        isActive: true
    },
    {
        title: 'Extended Stay Package',
        description: 'Stay longer and save more! Perfect for business travelers or extended vacations. Includes daily housekeeping and complimentary WiFi.',
        discount: 30,
        validFrom: new Date('2024-01-01'),
        validTo: new Date('2024-12-31'),
        terms: 'Valid for stays of 7 nights or more. Advance booking required. Subject to availability.',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
        isActive: true
    },
    {
        title: 'Romantic Honeymoon Package',
        description: 'Celebrate your love with our exclusive honeymoon package. Includes champagne, rose petals, couples spa treatment, and romantic dinner.',
        discount: 20,
        validFrom: new Date('2024-01-01'),
        validTo: new Date('2024-12-31'),
        terms: 'Valid for newlyweds with marriage certificate. Advance booking required. Package includes additional services.',
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b',
        isActive: true
    },
    {
        title: 'Family Fun Package',
        description: 'Perfect for family vacations! Includes kids activities, family dining discounts, and access to recreational facilities.',
        discount: 15,
        validFrom: new Date('2024-01-01'),
        validTo: new Date('2024-12-31'),
        terms: 'Valid for families with children under 12. Includes complimentary kids meals and activities.',
        image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa',
        isActive: true
    },
    {
        title: 'Early Bird Special',
        description: 'Book 30 days in advance and save! Great for planning ahead and securing the best rates for your stay.',
        discount: 35,
        validFrom: new Date('2024-01-01'),
        validTo: new Date('2024-12-31'),
        terms: 'Must be booked 30 days in advance. Non-refundable. Subject to availability.',
        image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de',
        isActive: true
    },
    {
        title: 'Business Traveler Package',
        description: 'Designed for business professionals. Includes meeting room access, business center facilities, and express laundry service.',
        discount: 18,
        validFrom: new Date('2024-01-01'),
        validTo: new Date('2024-12-31'),
        terms: 'Valid for corporate bookings. Includes business amenities and services.',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
        isActive: true
    }
];

const seedOffers = async () => {
    try {
        console.log('🎁 Seeding sample offers...');
        
        // Clear existing offers
        await Offer.destroy({ where: {} });
        
        // Insert sample offers
        for (const offerData of sampleOffers) {
            await Offer.create(offerData);
        }
        
        console.log('✅ Sample offers seeded successfully!');
        console.log(`🎯 Added ${sampleOffers.length} offers`);
        
    } catch (error) {
        console.error('❌ Offers seeding failed:', error);
        throw error;
    }
};

// Run seeding if this file is executed directly
if (require.main === module) {
    const runSeed = async () => {
        try {
            await sequelize.authenticate();
            await seedOffers();
            process.exit(0);
        } catch (error) {
            console.error('Seeding failed:', error);
            process.exit(1);
        }
    };
    runSeed();
}

module.exports = { seedOffers };