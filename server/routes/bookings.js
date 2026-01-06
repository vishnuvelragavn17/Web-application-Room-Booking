const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getAvailability, createBooking, getMyBookings, cancelBooking } = require('../controllers/bookingController');

router.get('/availability', getAvailability);
router.post('/', protect, createBooking);
router.get('/my', protect, getMyBookings);
router.put('/:id/cancel', protect, cancelBooking);

module.exports = router;
