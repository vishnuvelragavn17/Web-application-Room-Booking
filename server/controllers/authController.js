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

// @desc    Request OTP for registration
// @route   POST /api/auth/request-otp
exports.requestOTP = async (req, res) => {
  const { mobile } = req.body;
  if (!mobile) return res.status(400).json({ message: 'Mobile number required' });

  // Generate 4 digit OTP
  const otp = Math.floor(1000 + Math.random() * 9000).toString();

  // Save to DB (expires in 5 mins)
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
  await OTPLog.create({ mobile, otp, expiresAt });

  await sendMockOTP(mobile, otp);

  res.status(200).json({ message: 'OTP sent successfully' });
};

// @desc    Register a new user
// @route   POST /api/auth/register
exports.registerUser = async (req, res) => {
  const { name, mobile, otp, dob } = req.body;

  // 1. Verify OTP
  const otpRecord = await OTPLog.findOne({ mobile, otp, isUsed: false }).sort({ createdAt: -1 });

  if (!otpRecord) {
    return res.status(400).json({ message: 'Invalid OTP' });
  }

  if (new Date() > otpRecord.expiresAt) {
    return res.status(400).json({ message: 'OTP Expired' });
  }

  // 2. Check if user exists
  const userExists = await User.findOne({ mobile });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // 3. Hash DOB
  const salt = await bcrypt.genSalt(10);
  const hashedDob = await bcrypt.hash(dob, salt);

  // 4. Create User
  const user = await User.create({
    name,
    mobile,
    dob: hashedDob,
  });

  // Mark OTP as used
  otpRecord.isUsed = true;
  await otpRecord.save();

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      mobile: user.mobile,
      token: generateToken(user.id),
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

// @desc    Login user (Mobile + DOB)
// @route   POST /api/auth/login
exports.loginUser = async (req, res) => {
  const { mobile, dob } = req.body;

  const user = await User.findOne({ mobile });

  if (user && (await bcrypt.compare(dob, user.dob))) {
    res.json({
      _id: user.id,
      name: user.name,
      mobile: user.mobile,
      token: generateToken(user.id),
    });
  } else {
    res.status(401).json({ message: 'Invalid mobile or DOB' });
  }
};
