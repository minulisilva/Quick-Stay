const { sequelize } = require('./config/database');
const Content = require('./models/Content');

const valuesData = {
    values: [
        {
            title: 'Excellence',
            description: 'We strive for perfection in every detail, setting new benchmarks in luxury hospitality.',
            icon: 'Star'
        },
        {
            title: 'Service',
            description: 'Genuine care and anticipation of guest needs are at the heart of everything we do.',
            icon: 'Users'
        },
        {
            title: 'Integrity',
            description: 'We operate with honesty, transparency, and high ethical standards in all our interactions.',
            icon: 'Shield'
        },
        {
            title: 'Sustainability',
            description: 'Committed to protecting our environment and supporting the local communities we serve.',
            icon: 'Globe'
        }
    ]
};

async function addValuesSection() {
    try {
        await sequelize.authenticate();
        console.log('Connected to database');

        // Check if values section already exists
        const existing = await Content.findOne({ where: { page: 'about', section: 'values' } });

        if (existing) {
            console.log('Values section already exists, updating...');
            await existing.update({ data: valuesData });
            console.log('✓ Updated values section');
        } else {
            console.log('Creating new values section...');
            await Content.create({
                page: 'about',
                section: 'values',
                data: valuesData
            });
            console.log('✓ Created values section');
        }

        console.log('\n✅ Values section successfully added to About page CMS!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

addValuesSection();
