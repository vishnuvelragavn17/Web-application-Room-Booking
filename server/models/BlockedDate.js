const mongoose = require('mongoose');

const blockedDateSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true // One entry per date is enough to block the whole day
  },
  reason: {
    type: String,
    default: 'Maintenance'
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('BlockedDate', blockedDateSchema);
