const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  amount: Number,
  type: {
    type: String,
    enum: ['advance', 'refund', 'full_payment'],
    required: true,
  },
  transactionId: String,
  status: {
    type: String,
    default: 'success',
  },
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
