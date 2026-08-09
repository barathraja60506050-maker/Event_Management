const mongoose = require('mongoose');

const organizerRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: [100, 'Full name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    contactNumber: {
      type: String,
      required: [true, 'Contact number is required'],
      trim: true,
      maxlength: [30, 'Contact number is too long'],
    },
    purpose: {
      type: String,
      required: [true, 'Purpose is required'],
      trim: true,
      maxlength: [2000, 'Purpose cannot exceed 2000 characters'],
    },
    idProof: {
      type: String,
      required: [true, 'ID proof is required'],
    },
    passportPhoto: {
      type: String,
      required: [true, 'Passport photo is required'],
    },
    organizerId: {
      type: String,
      unique: true,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    approvedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('OrganizerRequest', organizerRequestSchema);
