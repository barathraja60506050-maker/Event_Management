const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const { REGISTRATION_STATUS } = require('../config/constants');

const registrationSchema = new mongoose.Schema(
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
    ticketNumber: {
      type: String,
      unique: true,
    },
    attendeeName: {
      type: String,
      required: true,
      trim: true,
    },
    attendeeEmail: {
      type: String,
      required: true,
      trim: true,
    },
    attendeePhone: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },
    qrCode: {
      type: String, // data URL / file path of the generated QR code image
      default: '',
    },
    status: {
      type: String,
      enum: Object.values(REGISTRATION_STATUS),
      default: REGISTRATION_STATUS.PENDING,
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
    },
    checkedInAt: {
      type: Date,
    },
    cancelledAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// A user can only hold one active registration per event.
registrationSchema.index({ user: 1, event: 1 }, { unique: true });
registrationSchema.index({ status: 1 });

registrationSchema.pre('validate', function generateTicketNumber(next) {
  if (!this.ticketNumber) {
    const stamp = Date.now().toString(36).toUpperCase();
    const random = uuidv4().split('-')[0].toUpperCase();
    this.ticketNumber = `TKT-${stamp}-${random}`;
  }
  next();
});

module.exports = mongoose.model('Registration', registrationSchema);
