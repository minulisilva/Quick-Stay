const Notification = require('../models/Notification');

const createNotification = async ({ type, title, message, link }) => {
    try {
        const notification = new Notification({
            type,
            title,
            message,
            link
        });
        await notification.save();
        console.log(`Notification created: ${title}`);
    } catch (error) {
        console.error('Error creating notification:', error.message);
    }
};

module.exports = { createNotification };
