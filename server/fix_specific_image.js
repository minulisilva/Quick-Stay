const { sequelize } = require('./config/database');
const { DataTypes } = require('sequelize');

// Simple Model Definitions
const DiningOption = sequelize.define('DiningOption', {
    image: DataTypes.STRING,
    name: DataTypes.STRING
}, { timestamps: false });

const Offer = sequelize.define('Offer', {
    image: DataTypes.STRING,
    offer: DataTypes.STRING,
    title: DataTypes.STRING
}, { timestamps: false });

const Experience = sequelize.define('Experience', {
    image: DataTypes.STRING,
    name: DataTypes.STRING
}, { timestamps: false });

const BAD_URL_PART = '1550966871'; // Asian/Chinese
const NEW_URL = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=3870&auto=format&fit=crop';

async function fix() {
    try {
        await sequelize.authenticate();
        console.log('DB Connected');

        const tables = [
            { name: 'DiningOption', model: DiningOption },
            { name: 'Offer', model: Offer },
            { name: 'Experience', model: Experience }
        ];

        let count = 0;

        for (const { name, model } of tables) {
            console.log(`Scanning ${name}...`);
            const items = await model.findAll();
            for (const item of items) {
                if (item.image && item.image.includes(BAD_URL_PART)) {
                    console.log(`Found bad URL in ${name} ID ${item.id}. Replacing...`);
                    item.image = NEW_URL;
                    await item.save();
                    count++;
                }
            }
        }

        console.log(`Fixed ${count} broken images.`);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

fix();
