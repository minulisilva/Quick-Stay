const { sequelize } = require('../config/database');
const User = require('./User');
const Booking = require('./Booking');
const Room = require('./Room');
const DiningOption = require('./DiningOption');
const DiningReservation = require('./DiningReservation');
const Experience = require('./Experience');
const Offer = require('./Offer');
const OfferReservation = require('./OfferReservation');
const Payment = require('./Payment');
const Feedback = require('./Feedback');
const Content = require('./Content');
const Staff = require('./Staff');
const Job = require('./Job');
const JobApplication = require('./JobApplication');
const Message = require('./Message');
const Notification = require('./Notification');
const Invoice = require('./Invoice');
const Award = require('./Award');

// User associations
User.hasMany(Booking, { foreignKey: 'userId' });
Booking.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(DiningReservation, { foreignKey: 'userId' });
DiningReservation.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(OfferReservation, { foreignKey: 'userId' });
OfferReservation.belongsTo(User, { foreignKey: 'userId' });

// DiningOption associations
DiningOption.hasMany(DiningReservation, { foreignKey: 'diningOptionId' });
DiningReservation.belongsTo(DiningOption, { foreignKey: 'diningOptionId' });

// Offer associations
Offer.hasMany(OfferReservation, { foreignKey: 'offerId' });
OfferReservation.belongsTo(Offer, { foreignKey: 'offerId' });

// Booking associations
Booking.hasMany(Payment, { foreignKey: 'bookingId' });
Payment.belongsTo(Booking, { foreignKey: 'bookingId' });

Booking.hasOne(Invoice, { foreignKey: 'bookingId' });
Invoice.belongsTo(Booking, { foreignKey: 'bookingId' });

// Job associations
Job.hasMany(JobApplication, { foreignKey: 'jobId' });
JobApplication.belongsTo(Job, { foreignKey: 'jobId' });

module.exports = {
    sequelize,
    User,
    Booking,
    Room,
    DiningOption,
    DiningReservation,
    Experience,
    Offer,
    OfferReservation,
    Payment,
    Feedback,
    Content,
    Staff,
    Job,
    JobApplication,
    Message,
    Notification,
    Invoice,
    Award
};
