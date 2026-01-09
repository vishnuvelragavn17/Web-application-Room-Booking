const User = require('../models/User');
const OTPLog = require('../models/OTPLog');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
    expiresIn: '30d',
  });
};

exports.requestOTPService = async (mobile) => {
  if (!mobile) throw new Error('Mobile number required');

  // Check if user exists BEFORE sending OTP
  const userExists = await User.findOne({ mobile });
  if (userExists) {
    throw new Error('User already exists');
  }

  // Generate OTP
  const otp = Math.floor(1000 + Math.random() * 9000).toString();

  // Save to DB
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
  await OTPLog.create({ mobile, otp, expiresAt });

  return { message: 'OTP sent successfully', otp }; // In real app, don't return OTP
};

exports.registerUserService = async (userData) => {
  const { name, mobile, otp, dob } = userData;

  // Verify OTP
  const otpRecord = await OTPLog.findOne({ mobile, otp, isUsed: false }).sort({ createdAt: -1 });

  if (!otpRecord) throw new Error('Invalid OTP');
  if (new Date() > otpRecord.expiresAt) throw new Error('OTP Expired');

  // Check if user exists again (double check)
  const userExists = await User.findOne({ mobile });
  if (userExists) throw new Error('User already exists');

  // Hash DOB
  const salt = await bcrypt.genSalt(10);
  const hashedDob = await bcrypt.hash(dob, salt);

  // Create User
  const user = await User.create({
    name,
    mobile,
    dob: hashedDob,
  });

  // Mark OTP used
  otpRecord.isUsed = true;
  await otpRecord.save();

  return {
    _id: user.id,
    name: user.name,
    mobile: user.mobile,
    role: user.role,
    token: generateToken(user.id),
  };
};

exports.loginUserService = async (credentials) => {
  const { mobile, dob } = credentials;

  const user = await User.findOne({ mobile });

  if (user && (await bcrypt.compare(dob, user.dob))) {
    return {
      _id: user.id,
      name: user.name,
      mobile: user.mobile,
      role: user.role,
      token: generateToken(user.id),
    };
  } else {
    throw new Error('Invalid mobile or DOB');
  }
};
