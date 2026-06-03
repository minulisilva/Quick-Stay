const { DiningOption } = require('./models');

const listDiningOptions = async () => {
    try {
        const options = await DiningOption.findAll();
        console.log("Dining Options in DB:", JSON.stringify(options, null, 2));
    } catch (error) {
        console.error("Error:", error.message);
    } finally {
        process.exit();
    }
};

listDiningOptions();
