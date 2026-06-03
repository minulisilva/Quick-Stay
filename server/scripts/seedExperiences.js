const { sequelize } = require('../config/database');
const Experience = require('../models/Experience');

const sampleExperiences = [
    {
        name: 'Luxury Spa & Wellness',
        title: 'Luxury Spa & Wellness',
        description: 'Indulge in our world-class spa treatments featuring traditional and modern wellness therapies. Relax in our serene environment with expert therapists.',
        duration: '2-3 hours',
        price: 150,
        category: 'Wellness',
        inclusions: ['Full body massage', 'Facial treatment', 'Sauna access', 'Relaxation lounge', 'Herbal tea'],
        image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874',
        isActive: true
    },
    {
        name: 'Sunset Yacht Cruise',
        title: 'Sunset Yacht Cruise',
        description: 'Experience breathtaking sunset views from our luxury yacht. Enjoy cocktails and light refreshments while cruising along the beautiful coastline.',
        duration: '3 hours',
        price: 200,
        category: 'Adventure',
        inclusions: ['Luxury yacht cruise', 'Welcome cocktails', 'Light refreshments', 'Professional crew', 'Photography service'],
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5',
        isActive: true
    },
    {
        name: 'Cultural City Tour',
        title: 'Cultural City Tour',
        description: 'Discover the rich history and culture of our beautiful city with our expert local guides. Visit iconic landmarks and hidden gems.',
        duration: '4 hours',
        price: 80,
        category: 'Cultural',
        inclusions: ['Professional guide', 'Transportation', 'Entry fees', 'Local snacks', 'Cultural insights'],
        image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e',
        isActive: true
    },
    {
        name: 'Gourmet Cooking Class',
        title: 'Gourmet Cooking Class',
        description: 'Learn to cook authentic local cuisine with our master chefs. Take home new skills and delicious recipes from your culinary adventure.',
        duration: '3 hours',
        price: 120,
        category: 'Culinary',
        inclusions: ['Master chef instruction', 'All ingredients', 'Recipe booklet', 'Full meal', 'Certificate'],
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136',
        isActive: true
    },
    {
        name: 'Adventure Water Sports',
        title: 'Adventure Water Sports',
        description: 'Get your adrenaline pumping with exciting water sports activities. Perfect for thrill-seekers and water enthusiasts.',
        duration: '2 hours',
        price: 100,
        category: 'Adventure',
        inclusions: ['Equipment rental', 'Safety briefing', 'Professional instructor', 'Safety gear', 'Action photos'],
        image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c',
        isActive: true
    },
    {
        name: 'Wine Tasting Experience',
        title: 'Wine Tasting Experience',
        description: 'Discover exquisite wines from local vineyards with our sommelier. Learn about wine pairing and tasting techniques.',
        duration: '2 hours',
        price: 90,
        category: 'Culinary',
        inclusions: ['Wine tasting session', 'Expert sommelier', 'Cheese platter', 'Wine education', 'Tasting notes'],
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3',
        isActive: true
    },
    {
        name: 'Nature Hiking Trail',
        title: 'Nature Hiking Trail',
        description: 'Explore pristine nature trails with stunning views and diverse wildlife. Perfect for nature lovers and photography enthusiasts.',
        duration: '4 hours',
        price: 60,
        category: 'Nature',
        inclusions: ['Experienced guide', 'Trail map', 'Water bottle', 'Light snacks', 'Wildlife spotting'],
        image: 'https://images.unsplash.com/photo-1551632811-561732d1e306',
        isActive: true
    },
    {
        name: 'Fitness & Yoga Session',
        title: 'Fitness & Yoga Session',
        description: 'Start your day with energizing fitness routines and peaceful yoga sessions led by certified instructors in our modern facility.',
        duration: '1.5 hours',
        price: 40,
        category: 'Wellness',
        inclusions: ['Certified instructor', 'Equipment provided', 'Yoga mat', 'Towel service', 'Refreshments'],
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b',
        isActive: true
    }
];

const seedExperiences = async () => {
    try {
        console.log('🎯 Seeding sample experiences...');
        
        // Clear existing experiences
        await Experience.destroy({ where: {} });
        
        // Insert sample experiences
        for (const experienceData of sampleExperiences) {
            await Experience.create(experienceData);
        }
        
        console.log('✅ Sample experiences seeded successfully!');
        console.log(`🌟 Added ${sampleExperiences.length} experiences`);
        
    } catch (error) {
        console.error('❌ Experiences seeding failed:', error);
        throw error;
    }
};

// Run seeding if this file is executed directly
if (require.main === module) {
    const runSeed = async () => {
        try {
            await sequelize.authenticate();
            await seedExperiences();
            process.exit(0);
        } catch (error) {
            console.error('Seeding failed:', error);
            process.exit(1);
        }
    };
    runSeed();
}

module.exports = { seedExperiences };