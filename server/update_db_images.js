const { sequelize } = require('./config/database');
const { DataTypes, Op } = require('sequelize');

// Define models briefly for the update script
const DiningOption = sequelize.define('DiningOption', {
    image: DataTypes.STRING
}, { timestamps: false });

const Offer = sequelize.define('Offer', {
    image: DataTypes.STRING
}, { timestamps: false });

const Experience = sequelize.define('Experience', {
    image: DataTypes.STRING
}, { timestamps: false });

// URL Mappings (Broken part -> New Full URL)
const replacements = [
    {
        badPart: '1550966871-3ed3c47e2ce2', // Chinese/Asian
        newUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=3870&auto=format&fit=crop'
    },
    {
        badPart: '1615937691194-97dbd3f3e6ef', // Seafood/Restaurant
        newUrl: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=3870&auto=format&fit=crop'
    },
    {
        badPart: '1571896349842-68cfd4d8ac85', // Breakfast
        newUrl: 'https://images.unsplash.com/photo-1525648199074-ce3071bb715d?q=80&w=3870&auto=format&fit=crop'
    },
    {
        badPart: '1579624536979-ea4cc8b60f1b', // Romantic
        newUrl: 'https://images.unsplash.com/photo-1510076857177-7470076d4098?q=80&w=3870&auto=format&fit=crop'
    }
];

async function updateImages() {
    try {
        await sequelize.authenticate();
        console.log('Connected to database.');

        const models = [
            { name: 'DiningOption', model: DiningOption },
            { name: 'Offer', model: Offer },
            { name: 'Experience', model: Experience }
        ];

        for (const { name, model } of models) {
            console.log(`\nChecking ${name}s...`);
            const items = await model.findAll();

            for (const item of items) {
                if (!item.image) continue;

                let updated = false;
                for (const { badPart, newUrl } of replacements) {
                    if (item.image.includes(badPart)) {
                        console.log(`Updating ${name} ID ${item.id}: replacing broken image...`);
                        item.image = newUrl;
                        updated = true;
                        break; // Assume one match per image URL
                    }
                }

                if (updated) {
                    await item.save();
                    console.log(`✓ Saved ${name} ID ${item.id}`);
                }
            }
        }

        console.log('\nImage update process completed.');
        process.exit(0);
    } catch (error) {
        console.error('Error updating images:', error);
        process.exit(1);
    }
}

updateImages();
