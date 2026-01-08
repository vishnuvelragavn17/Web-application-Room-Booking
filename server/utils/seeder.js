require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/room_booking';

const seedAdmin = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB Connected...');

    const adminMobile = '9999999999';
    const adminDob = '2000-01-01'; // YYYY-MM-DD

    // Check if admin exists
    const userExists = await User.findOne({ mobile: adminMobile });
    if (userExists) {
        console.log('Admin already exists.');
        // Force update role to admin if it exists but isn't admin
        userExists.role = 'admin';
        await userExists.save();
        console.log('Updated existing user role to admin.');
        process.exit();
    }

    // Hash DOB
    const salt = await bcrypt.genSalt(10);
    const hashedDob = await bcrypt.hash(adminDob, salt);

    await User.create({
      name: 'Super Admin',
      mobile: adminMobile,
      dob: hashedDob,
      role: 'admin',
      address: 'Admin HQ',
      city: 'Cloud',
      state: 'Secure',
      pinCode: '000000'
    });

    console.log('Admin User Created Successfully!');
    console.log(`Credentials -> Mobile: ${adminMobile}, DOB: ${adminDob}`);
    process.exit();

  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
