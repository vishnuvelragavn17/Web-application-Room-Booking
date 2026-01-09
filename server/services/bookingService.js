const Booking = require('../models/Booking');
const Payment = require('../models/Payment');

exports.getAvailabilityService = async (date) => {
  const searchDate = new Date(date);

  const bookings = await Booking.find({
    date: searchDate,
    status: 'confirmed'
  }).select('timeSlot status');

  const bookedSlots = bookings.map(b => b.timeSlot);

  const allSlots = [
    '09:00-10:00', '10:00-11:00', '11:00-12:00',
    '12:00-13:00', '13:00-14:00', '14:00-15:00',
    '15:00-16:00', '16:00-17:00', '17:00-18:00'
  ];

  return allSlots.map(slot => ({
    slot,
    isAvailable: !bookedSlots.includes(slot)
  }));
};

exports.createBookingService = async (userId, bookingData) => {
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const { date, timeSlot, eventType, attendees, needHelper, foodNeeded, extraItems, address, secondaryPhone } = bookingData;

    // SERVER-SIDE PRICING
    const FIXED_TOTAL_AMOUNT = 5000;
    const ADVANCE_PERCENTAGE = 0.20;
    const calculateAdvance = (total) => total * ADVANCE_PERCENTAGE;

    const totalAmount = FIXED_TOTAL_AMOUNT;
    const advancePaid = calculateAdvance(totalAmount);

    const existingBooking = await Booking.findOne({
      date: new Date(date),
      timeSlot,
      status: 'confirmed'
    }).session(session);

    if (existingBooking) {
      throw new Error('Slot already booked');
    }

    const booking = await Booking.create([{
      user: userId,
      date: new Date(date),
      timeSlot,
      eventType,
      attendees,
      needHelper,
      foodNeeded,
      extraItems,
      address,
      secondaryPhone,
      totalAmount,
      advancePaid,
      status: 'confirmed',
      paymentStatus: 'paid'
    }], { session });

    await Payment.create([{
      booking: booking[0]._id,
      user: userId,
      amount: advancePaid,
      type: 'advance',
      status: 'success',
      transactionId: 'TXN_' + Date.now()
    }], { session });

    await session.commitTransaction();
    return booking[0];

  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

exports.getUserBookingsService = async (userId) => {
  return await Booking.find({ user: userId }).sort({ date: -1 });
};

exports.cancelBookingService = async (bookingId, userId) => {
  const booking = await Booking.findById(bookingId);

  if (!booking) throw new Error('Booking not found');
  if (booking.user.toString() !== userId) throw new Error('Not authorized');
  if (booking.status === 'cancelled') throw new Error('Already cancelled');

  const bookingDate = new Date(booking.date);
  const now = new Date();
  const hoursDiff = (bookingDate - now) / 36e5;

  let refundAmount = 0;
  if (hoursDiff > 24) {
    refundAmount = booking.advancePaid * 0.9;
  } else {
    refundAmount = booking.advancePaid * 0.5;
  }

  booking.status = 'cancelled';
  booking.paymentStatus = 'refunded';
  await booking.save();

  await Payment.create({
    booking: booking._id,
    user: userId,
    amount: refundAmount,
    type: 'refund',
    status: 'success',
    transactionId: 'REF_' + Date.now()
  });

  return { message: 'Booking cancelled', refundAmount };
};

exports.postponeBookingService = async (bookingId, userId, newData) => {
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const { date, timeSlot } = newData;
    const booking = await Booking.findById(bookingId).session(session);

    if (!booking) throw new Error('Booking not found');
    if (booking.user.toString() !== userId) throw new Error('Not authorized');
    if (booking.status === 'cancelled') throw new Error('Cannot postpone cancelled booking');

    const existingBooking = await Booking.findOne({
      date: new Date(date),
      timeSlot,
      status: 'confirmed'
    }).session(session);

    if (existingBooking) throw new Error('New slot is already booked');

    booking.date = new Date(date);
    booking.timeSlot = timeSlot;

    await booking.save({ session });
    await session.commitTransaction();

    return booking;

  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};
