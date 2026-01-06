require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');
const initScheduledJobs = require('./utils/scheduler');

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/room_booking';

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');

    // Initialize Cron Jobs
    initScheduledJobs();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
