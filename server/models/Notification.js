const mongoose = require('mongoose');
const { NOTIFICATION_TYPES } = require('../config/constants');

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(NOTIFICATION_TYPES),
      default: NOTIFICATION_TYPES.INFO,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

notificationSchema.index({ user: 1, isRead: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
