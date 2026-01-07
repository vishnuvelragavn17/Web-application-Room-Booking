const Booking = require('../models/Booking');
const Payment = require('../models/Payment');

// @desc    Get availability for a specific date
// @route   GET /api/bookings/availability?date=YYYY-MM-DD
exports.getAvailability = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ message: 'Date is required' });

    const searchDate = new Date(date);

    // Find all confirmed bookings for that date
    const bookings = await Booking.find({
      date: searchDate,
      status: 'confirmed'
    }).select('timeSlot status');

    const bookedSlots = bookings.map(b => b.timeSlot);

    // Mock Time Slots (Standard Venue Hours)
    const allSlots = [
      '09:00-10:00', '10:00-11:00', '11:00-12:00',
      '12:00-13:00', '13:00-14:00', '14:00-15:00',
      '15:00-16:00', '16:00-17:00', '17:00-18:00'
    ];

    const availability = allSlots.map(slot => ({
      slot,
      isAvailable: !bookedSlots.includes(slot)
    }));

    res.json(availability);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new booking
// @route   POST /api/bookings
exports.createBooking = async (req, res) => {
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const { date, timeSlot, eventType, attendees, needHelper, foodNeeded, extraItems } = req.body;

    // SERVER-SIDE PRICING LOGIC
    const FIXED_TOTAL_AMOUNT = 5000;
    const ADVANCE_PERCENTAGE = 0.20; // 20%
    const calculateAdvance = (total) => total * ADVANCE_PERCENTAGE;

    const totalAmount = FIXED_TOTAL_AMOUNT;
    const advancePaid = calculateAdvance(totalAmount);

    // Check availability again (Double check inside transaction)
    const existingBooking = await Booking.findOne({
      date: new Date(date),
      timeSlot,
      status: 'confirmed'
    }).session(session);

    if (existingBooking) {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Slot already booked' });
    }

    // Create Booking
    const booking = await Booking.create([{
      user: req.user.id,
      date: new Date(date),
      timeSlot,
      eventType,
      attendees,
      needHelper,
      foodNeeded,
      extraItems,
      totalAmount: totalAmount,
      advancePaid: advancePaid,
      status: 'confirmed', // Assuming immediate payment success in this flow
      paymentStatus: 'paid'
    }], { session });

    // Log Payment
    await Payment.create([{
      booking: booking[0]._id,
      user: req.user.id,
      amount: advancePaid,
      type: 'advance',
      status: 'success',
      transactionId: 'TXN_' + Date.now()
    }], { session });

    await session.commitTransaction();
    res.status(201).json(booking[0]);

  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ message: error.message });
  } finally {
    session.endSession();
  }
};

// @desc    Get user booking history
// @route   GET /api/bookings/my
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).sort({ date: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Already cancelled' });
    }

    // Cancellation Logic
    const bookingDate = new Date(booking.date);
    const now = new Date();
    const hoursDiff = (bookingDate - now) / 36e5;

    let refundAmount = 0;

    // Simple Rule: > 24 hours = 90% refund, < 24 hours = 50% refund
    if (hoursDiff > 24) {
      refundAmount = booking.advancePaid * 0.9;
    } else {
      refundAmount = booking.advancePaid * 0.5;
    }

    booking.status = 'cancelled';
    booking.paymentStatus = 'refunded'; // Simplified
    await booking.save();

    // Log Refund
    await Payment.create({
      booking: booking._id,
      user: req.user.id,
      amount: refundAmount,
      type: 'refund',
      status: 'success',
      transactionId: 'REF_' + Date.now()
    });

    res.json({ message: 'Booking cancelled', refundAmount });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
