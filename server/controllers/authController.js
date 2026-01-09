const User = require('../models/User');
const OTPLog = require('../models/OTPLog');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Mock function to send OTP
const sendMockOTP = async (mobile, otp) => {
  console.log(`[MOCK SMS] Sending OTP ${otp} to ${mobile}`);
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
    expiresIn: '30d',
  });
};

const authService = require('../services/authService');

// @desc    Request OTP for registration
// @route   POST /api/auth/request-otp
exports.requestOTP = async (req, res) => {
  try {
    const result = await authService.requestOTPService(req.body.mobile);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Register a new user
// @route   POST /api/auth/register
exports.registerUser = async (req, res) => {
  try {
    const user = await authService.registerUserService(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Login user (Mobile + DOB)
// @route   POST /api/auth/login
exports.loginUser = async (req, res) => {
  try {
    const user = await authService.loginUserService(req.body);
    res.json(user);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};
