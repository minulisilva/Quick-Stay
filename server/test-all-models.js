const models = [
    'User', 'Booking', 'Room', 'DiningOption', 'DiningReservation',
    'Experience', 'Offer', 'OfferReservation', 'Payment', 'Feedback',
    'Content', 'Staff', 'Job', 'JobApplication', 'Message',
    'Notification', 'Invoice'
];

for (const name of models) {
    try {
        console.log(`Loading ${name}...`);
        require(`./models/${name}`);
        console.log(`Success: ${name}`);
    } catch (err) {
        console.error(`FAILED: ${name}`);
        console.error(err);
        process.exit(1);
    }
}
console.log('All models loaded individually.');
