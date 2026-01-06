const cron = require('node-cron');
const Booking = require('../models/Booking');
const Notification = require('../models/Notification'); // We need to create this model first

// Mock Email/SMS Service
const sendNotification = async (userId, message) => {
  console.log(`[NOTIFICATION] To User ${userId}: ${message}`);
  // In real app, save to DB
  // await Notification.create({ user: userId, message });
};

const initScheduledJobs = () => {
  // Run every day at 09:00 AM
  cron.schedule('0 9 * * *', async () => {
    console.log('Running daily reminder job...');

    try {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);
      nextWeek.setHours(0, 0, 0, 0);

      // Find bookings for Tomorrow
      const tomorrowBookings = await Booking.find({
        date: tomorrow,
        status: 'confirmed'
      }).populate('user');

      tomorrowBookings.forEach(booking => {
        if (booking.user) {
          sendNotification(booking.user._id, `Reminder: You have a booking tomorrow at ${booking.timeSlot}`);
        }
      });

      // Find bookings for Next Week
      const nextWeekBookings = await Booking.find({
        date: nextWeek,
        status: 'confirmed'
      }).populate('user');

      nextWeekBookings.forEach(booking => {
        if (booking.user) {
          sendNotification(booking.user._id, `Reminder: You have a booking next week on ${nextWeek.toDateString()}`);
        }
      });

    } catch (error) {
      console.error('Error in scheduled job:', error);
    }
  });
};

module.exports = initScheduledJobs;
