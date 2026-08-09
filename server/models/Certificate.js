const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema(
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
    fileUrl: {
      type: String,
      required: [true, 'Certificate file is required'],
    },
    certificateNumber: {
      type: String,
      unique: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    issuedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

certificateSchema.index({ user: 1, event: 1 }, { unique: true });

certificateSchema.pre('validate', function generateCertNumber(next) {
  if (!this.certificateNumber) {
    this.certificateNumber = `CERT-${Date.now().toString(36).toUpperCase()}-${Math.random()
      .toString(36)
      .slice(2, 6)
      .toUpperCase()}`;
  }
  next();
});

module.exports = mongoose.model('Certificate', certificateSchema);
