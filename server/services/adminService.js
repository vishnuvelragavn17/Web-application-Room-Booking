const Booking = require('../models/Booking');
const BlockedDate = require('../models/BlockedDate');

exports.getAllBookingsService = async () => {
  // Return only real bookings. Blocked dates are in a separate collection.
  return await Booking.find({})
    .populate('user', 'name mobile')
    .sort({ date: -1 });
};

exports.cancelBookingAdminService = async (bookingId) => {
  const booking = await Booking.findById(bookingId);

  if (!booking) throw new Error('Booking not found');
  if (booking.status === 'cancelled') throw new Error('Already cancelled');

  booking.status = 'cancelled';
  booking.paymentStatus = 'refunded';
  await booking.save();

  return booking;
};

exports.blockDateService = async (date, reason, adminId) => {
  const targetDate = new Date(date);

  // 1. Check if already blocked
  const alreadyBlocked = await BlockedDate.findOne({ date: targetDate });
  if (alreadyBlocked) {
    throw new Error('Date is already blocked.');
  }

  // 2. Check for existing confirmed bookings on that date
  const existingBookings = await Booking.find({ date: targetDate, status: 'confirmed' });
  if (existingBookings.length > 0) {
      throw new Error('Cannot block date. Existing bookings found.');
  }

  // 3. Create BlockedDate entry
  await BlockedDate.create({
    date: targetDate,
    reason: reason || 'Maintenance',
    admin: adminId
  });

  return { message: 'Date blocked successfully' };
};
