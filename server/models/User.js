const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
  },
  dob: {
    type: String, // Store as hashed string
    required: true,
  },
  address: String,
  city: String,
  state: String,
  pinCode: String,
  altMobile: String,
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
