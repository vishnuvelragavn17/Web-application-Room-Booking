const express = require('express');
const router = express.Router();
const { requestOTP, registerUser, loginUser } = require('../controllers/authController');

router.post('/request-otp', requestOTP);
router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;
