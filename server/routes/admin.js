const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const { getAllBookings, cancelBookingAdmin, blockDate } = require('../controllers/adminController');

router.get('/bookings', protect, admin, getAllBookings);
router.put('/bookings/:id/cancel', protect, admin, cancelBookingAdmin);
router.post('/block-date', protect, admin, blockDate);

module.exports = router;
