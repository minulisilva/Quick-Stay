const { DiningReservation } = require('./models');

const listDiningReservations = async () => {
    try {
        const reservations = await DiningReservation.findAll();
        console.log("Dining Reservations in DB:", JSON.stringify(reservations, null, 2));
    } catch (error) {
        console.error("Error:", error.message);
    } finally {
        process.exit();
    }
};

listDiningReservations();
