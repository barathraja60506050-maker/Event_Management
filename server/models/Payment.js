const mongoose = require('mongoose');
const { PAYMENT_STATUS } = require('../config/constants');

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    registration: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Registration',
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    method: {
      type: String,
      enum: ['card', 'upi', 'netbanking', 'wallet', 'free'],
      default: 'card',
    },
    status: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.PENDING,
    },
    // This is a demo payment system: no real gateway is called. This field
    // just stores a fake reference id so receipts look realistic.
    transactionRef: {
      type: String,
      unique: true,
    },
    receiptNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    paidAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

paymentSchema.index({ user: 1 });
paymentSchema.index({ event: 1 });
paymentSchema.index({ status: 1 });

paymentSchema.pre('validate', function generateRefs(next) {
  if (!this.transactionRef) {
    this.transactionRef = `TXN-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  }
  next();
});

module.exports = mongoose.model('Payment', paymentSchema);
