const { sequelize } = require('./config/database');
const Award = require('./models/Award');

const awards = [
    {
        year: 2024,
        title: "Best Luxury Hotel in Sri Lanka",
        organization: "World Travel Awards",
        description: "Recognized for exceptional service, world-class amenities, and a commitment to providing an unforgettable guest experience.",
        displayOrder: 1,
        visible: true
    },
    {
        year: 2023,
        title: "Culinary Excellence Award",
        organization: "Gastronomy International",
        description: "Awarded to 'Harbour Court' for its outstanding international buffet and innovative global cuisine.",
        displayOrder: 2,
        visible: true
    },
    {
        year: 2023,
        title: "Sustainable Hospitality Leader",
        organization: "Green Globe",
        description: "Acknowledging our significant efforts in reducing carbon footprint and supporting local community sustainability initiatives.",
        displayOrder: 3,
        visible: true
    },
    {
        year: 2022,
        title: "Top 10 City Hotels in Asia",
        organization: "Travel & Leisure",
        description: "Voted by travelers worldwide as one of the premier destinations for luxury and comfort in the Asian region.",
        displayOrder: 4,
        visible: true
    },
    {
        year: 2021,
        title: "Best Hotel Spa",
        organization: "Wellness Asia",
        description: "Our Spa was honored for its holistic treatments, expert therapists, and serene ambiance.",
        displayOrder: 5,
        visible: true
    },
    {
        year: 2020,
        title: "Travelers' Choice Winner",
        organization: "TripAdvisor",
        description: "Consistently earning great reviews from travelers and ranked within the top 10% of properties on TripAdvisor.",
        displayOrder: 6,
        visible: true
    }
];

async function seedAwards() {
    try {
        await sequelize.authenticate();
        console.log('Connected to database');

        // Clear existing awards
        await Award.destroy({ where: {} });
        console.log('Cleared existing awards');

        // Insert new awards
        for (const award of awards) {
            await Award.create(award);
            console.log(`✓ Added: ${award.title} (${award.year})`);
        }

        console.log(`\n✅ Successfully seeded ${awards.length} awards!`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding awards:', error);
        process.exit(1);
    }
}

seedAwards();
