const Booking = require('../models/Booking');

// @desc    Get all bookings (Admin)
// @route   GET /api/admin/bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('user', 'name mobile')
      .sort({ date: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel a booking (Admin)
// @route   PUT /api/admin/bookings/:id/cancel
exports.cancelBookingAdmin = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Already cancelled' });
    }

    booking.status = 'cancelled';
    booking.paymentStatus = 'refunded'; // Simplified for admin action
    await booking.save();

    res.json({ message: 'Booking cancelled by admin', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark booking as completed
// @route   PUT /api/admin/bookings/:id/complete
exports.completeBookingAdmin = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = 'completed';
    await booking.save();

    res.json({ message: 'Booking marked as completed', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Block a date (Create a dummy booking)
// @route   POST /api/admin/block-date
exports.blockDate = async (req, res) => {
  try {
    const { date, reason } = req.body;

    if (!date) return res.status(400).json({ message: 'Date is required' });

    // Check if any booking exists for that date
    const existingBookings = await Booking.find({ date: new Date(date), status: 'confirmed' });
    if (existingBookings.length > 0) {
        return res.status(400).json({ message: 'Cannot block date. Existing bookings found.' });
    }

    // Create a block for all standard slots
    const allSlots = [
      '09:00-10:00', '10:00-11:00', '11:00-12:00',
      '12:00-13:00', '13:00-14:00', '14:00-15:00',
      '15:00-16:00', '16:00-17:00', '17:00-18:00'
    ];

    const blockBookings = allSlots.map(slot => ({
        user: req.user.id, // Admin User
        date: new Date(date),
        timeSlot: slot,
        eventType: 'BLOCKED: ' + (reason || 'Maintenance'),
        status: 'confirmed',
        paymentStatus: 'paid',
        totalAmount: 0,
        advancePaid: 0
    }));

    await Booking.insertMany(blockBookings);

    res.status(201).json({ message: 'Date blocked successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
