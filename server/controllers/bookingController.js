const bookingService = require('../services/bookingService');

// @desc    Get availability for a specific date
// @route   GET /api/bookings/availability?date=YYYY-MM-DD
exports.getAvailability = async (req, res) => {
  try {
    if (!req.query.date) return res.status(400).json({ message: 'Date is required' });
    const availability = await bookingService.getAvailabilityService(req.query.date);
    res.json(availability);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new booking
// @route   POST /api/bookings
exports.createBooking = async (req, res) => {
  try {
    const booking = await bookingService.createBookingService(req.user.id, req.body);
    res.status(201).json(booking);
  } catch (error) {
    const statusCode = error.message === 'Slot already booked' ? 400 : 500;
    res.status(statusCode).json({ message: error.message });
  }
};

// @desc    Get user booking history
// @route   GET /api/bookings/my
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await bookingService.getUserBookingsService(req.user.id);
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Postpone (Reschedule) a booking
// @route   PUT /api/bookings/:id/postpone
exports.postponeBooking = async (req, res) => {
  try {
    const booking = await bookingService.postponeBookingService(req.params.id, req.user.id, req.body);
    res.json({ message: 'Booking rescheduled successfully', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
exports.cancelBooking = async (req, res) => {
  try {
    const result = await bookingService.cancelBookingService(req.params.id, req.user.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
