const Booking = require('../models/Booking');

exports.getAllBookingsService = async () => {
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
  // Check existing
  const existingBookings = await Booking.find({ date: new Date(date), status: 'confirmed' });
  if (existingBookings.length > 0) {
      throw new Error('Cannot block date. Existing bookings found.');
  }

  const allSlots = [
    '09:00-10:00', '10:00-11:00', '11:00-12:00',
    '12:00-13:00', '13:00-14:00', '14:00-15:00',
    '15:00-16:00', '16:00-17:00', '17:00-18:00'
  ];

  const blockBookings = allSlots.map(slot => ({
      user: adminId,
      date: new Date(date),
      timeSlot: slot,
      eventType: 'BLOCKED: ' + (reason || 'Maintenance'),
      status: 'confirmed',
      paymentStatus: 'paid',
      totalAmount: 0,
      advancePaid: 0
  }));

  await Booking.insertMany(blockBookings);
  return { message: 'Date blocked successfully' };
};
