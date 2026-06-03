const { Offer } = require('./models');

const listOffers = async () => {
    try {
        const offers = await Offer.findAll();
        console.log("Offers in DB:", JSON.stringify(offers, null, 2));
    } catch (error) {
        console.error("Error:", error.message);
    } finally {
        process.exit();
    }
};

listOffers();
