const { sequelize } = require('../config/database');
const Room = require('../models/Room');
const DiningOption = require('../models/DiningOption');

const sampleRooms = [
    {
        name: 'Deluxe Ocean View',
        type: 'Deluxe',
        description: 'Spacious room with stunning ocean views, king-size bed, and modern amenities.',
        price: 250,
        capacity: 2,
        amenities: ['Ocean View', 'King Bed', 'Mini Bar', 'WiFi', 'Air Conditioning', 'Room Service'],
        images: [
            'https://images.unsplash.com/photo-1566073771259-6a8506099945',
            'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa'
        ],
        available: true
    },
    {
        name: 'Executive Suite',
        type: 'Suite',
        description: 'Luxurious suite with separate living area, premium furnishings, and city views.',
        price: 450,
        capacity: 4,
        amenities: ['City View', 'Living Area', 'Premium Furnishing', 'WiFi', 'Mini Bar', 'Butler Service'],
        images: [
            'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b',
            'https://images.unsplash.com/photo-1578683010236-d716f9a3f461'
        ],
        available: true
    },
    {
        name: 'Standard Twin Room',
        type: 'Standard',
        description: 'Comfortable room with twin beds, perfect for business travelers or friends.',
        price: 150,
        capacity: 2,
        amenities: ['Twin Beds', 'Work Desk', 'WiFi', 'Air Conditioning', 'TV', 'Coffee Maker'],
        images: [
            'https://images.unsplash.com/photo-1549294413-26f195200c16',
            'https://images.unsplash.com/photo-1510076857177-7470076d4098'
        ],
        available: true
    },
    {
        name: 'Family Room',
        type: 'Family',
        description: 'Spacious family room with multiple beds and child-friendly amenities.',
        price: 320,
        capacity: 6,
        amenities: ['Multiple Beds', 'Child Safety', 'Family Entertainment', 'WiFi', 'Kitchenette', 'Balcony'],
        images: [
            'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7',
            'https://images.unsplash.com/photo-1552566626-52f8b828add9'
        ],
        available: true
    },
    {
        name: 'Presidential Suite',
        type: 'Presidential',
        description: 'Ultimate luxury with panoramic views, private terrace, and exclusive services.',
        price: 800,
        capacity: 4,
        amenities: ['Panoramic View', 'Private Terrace', 'Jacuzzi', 'Personal Butler', 'Premium Bar', 'Dining Area'],
        images: [
            'https://images.unsplash.com/photo-1559339352-11d035aa65de',
            'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4'
        ],
        available: true
    }
];

const sampleDiningVenues = [
    {
        name: 'Ocean Breeze Restaurant',
        cuisine: 'International',
        description: 'Fine dining with international cuisine and stunning ocean views. Our chefs create culinary masterpieces using the finest ingredients.',
        features: ['Ocean View', 'Fine Dining', 'Wine Cellar', 'Private Dining', 'Live Music'],
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4'
    },
    {
        name: 'Spice Garden',
        cuisine: 'Asian Fusion',
        description: 'Authentic Asian flavors with a modern twist. Experience the rich spices and traditional cooking methods of Asia.',
        features: ['Authentic Spices', 'Traditional Cooking', 'Vegetarian Options', 'Tea Ceremony', 'Garden Setting'],
        image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de'
    },
    {
        name: 'Rooftop Lounge',
        cuisine: 'Bar & Grill',
        description: 'Casual dining and cocktails with panoramic city views. Perfect for sunset drinks and light meals.',
        features: ['City Views', 'Cocktail Bar', 'Sunset Views', 'Live DJ', 'Outdoor Seating'],
        image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187'
    },
    {
        name: 'Café Delights',
        cuisine: 'Café',
        description: 'Cozy café serving fresh pastries, artisan coffee, and light meals throughout the day.',
        features: ['Artisan Coffee', 'Fresh Pastries', 'All Day Dining', 'Free WiFi', 'Outdoor Terrace'],
        image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0'
    }
];

const seedData = async () => {
    try {
        console.log('🌱 Seeding rooms and dining venues...');
        
        // Clear existing data
        await Room.destroy({ where: {} });
        await DiningOption.destroy({ where: {} });
        
        // Insert sample rooms
        for (const roomData of sampleRooms) {
            await Room.create(roomData);
        }
        
        // Insert sample dining venues
        for (const venueData of sampleDiningVenues) {
            await DiningOption.create(venueData);
        }
        
        console.log('✅ Sample data seeded successfully!');
        console.log(`📦 Added ${sampleRooms.length} rooms`);
        console.log(`🍽️ Added ${sampleDiningVenues.length} dining venues`);
        
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        throw error;
    }
};

// Run seeding if this file is executed directly
if (require.main === module) {
    const runSeed = async () => {
        try {
            await sequelize.authenticate();
            await seedData();
            process.exit(0);
        } catch (error) {
            console.error('Seeding failed:', error);
            process.exit(1);
        }
    };
    runSeed();
}

module.exports = { seedData };