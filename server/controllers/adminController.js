const Booking = require('../models/Booking');

const adminService = require('../services/adminService');

// @desc    Get all bookings (Admin)
// @route   GET /api/admin/bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await adminService.getAllBookingsService();
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel a booking (Admin)
// @route   PUT /api/admin/bookings/:id/cancel
exports.cancelBookingAdmin = async (req, res) => {
  try {
    const result = await adminService.cancelBookingAdminService(req.params.id);
    res.json(result);
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

    const result = await adminService.blockDateService(date, reason, req.user.id);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
