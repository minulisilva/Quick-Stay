const { sequelize } = require('./config/database');
const { DataTypes } = require('sequelize');

// Define models
const DiningOption = sequelize.define('DiningOption', {
    name: DataTypes.STRING,
    image: DataTypes.STRING
}, { timestamps: false });

const Offer = sequelize.define('Offer', {
    offer: DataTypes.STRING,
    title: DataTypes.STRING,
    image: DataTypes.STRING
}, { timestamps: false });

const Experience = sequelize.define('Experience', {
    name: DataTypes.STRING,
    image: DataTypes.STRING
}, { timestamps: false });

// Updates Map
const updates = [
    // Dining
    {
        model: 'DiningOption',
        searchField: 'name',
        matches: [
            { term: 'Yue Chuan', url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=3870&auto=format&fit=crop' },
            { term: 'Ocean', url: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=3870&auto=format&fit=crop' },
            { term: 'Harbour', url: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=3774&auto=format&fit=crop' }
        ]
    },
    // Offers (Model field might be 'offer' or 'title')
    {
        model: 'Offer',
        searchField: 'offer', // from OfferRoutes: req.body.offer
        matches: [
            { term: 'Breakfast', url: 'https://images.unsplash.com/photo-1525648199074-ce3071bb715d?q=80&w=3870&auto=format&fit=crop' },
            { term: 'Romantic', url: 'https://images.unsplash.com/photo-1510076857177-7470076d4098?q=80&w=3870&auto=format&fit=crop' },
            { term: 'Suite', url: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=3870&auto=format&fit=crop' }
        ]
    },
    // Experiences
    {
        model: 'Experience',
        searchField: 'name',
        matches: [
            { term: 'Pool', url: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=3870&auto=format&fit=crop' },
            { term: 'Spa', url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=3870&auto=format&fit=crop' },
            { term: 'Fitness', url: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=3870&auto=format&fit=crop' }
        ]
    }
];

async function updateImagesSmart() {
    try {
        await sequelize.authenticate();
        console.log('Connected.');

        const models = {
            DiningOption,
            Offer,
            Experience
        };

        for (const updateGroup of updates) {
            const Model = models[updateGroup.model];
            const items = await Model.findAll();
            console.log(`Scanning ${updateGroup.model} (${items.length} items)...`);

            for (const item of items) {
                const nameVal = item[updateGroup.searchField] || item.title || item.name; // Fallback

                if (!nameVal) continue;

                for (const match of updateGroup.matches) {
                    if (nameVal.includes(match.term)) {
                        console.log(`Matched '${nameVal}' -> Updating Image`);
                        item.image = match.url;
                        await item.save();
                    }
                }
            }
        }

        console.log('Done.');
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

updateImagesSmart();
