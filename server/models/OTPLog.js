const mongoose = require('mongoose');

const otpLogSchema = new mongoose.Schema({
  mobile: String,
  otp: String,
  expiresAt: Date,
  isUsed: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

module.exports = mongoose.model('OTPLog', otpLogSchema);
