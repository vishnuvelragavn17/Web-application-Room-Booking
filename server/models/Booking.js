const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date, // Normalized to start of day
    required: true,
  },
  timeSlot: {
    type: String, // e.g., "10:00-11:00"
    required: true,
  },
  eventType: String,
  attendees: Number,
  needHelper: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled', 'completed'],
    default: 'confirmed',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending',
  },
  totalAmount: Number,
  advancePaid: Number,
}, { timestamps: true });

// Compound index to prevent double booking
bookingSchema.index({ date: 1, timeSlot: 1, status: 1 }, { unique: true, partialFilterExpression: { status: 'confirmed' } });

module.exports = mongoose.model('Booking', bookingSchema);
