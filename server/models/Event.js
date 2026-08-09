const mongoose = require('mongoose');
const slugify = require('slugify');
const { EVENT_STATUS } = require('../config/constants');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Event category is required'],
      trim: true,
    },
    banner: {
      type: String,
      default: '',
    },
    venue: {
      type: String,
      required: [true, 'Venue is required'],
      trim: true,
    },
    eventDate: {
      type: Date,
      required: [true, 'Event date is required'],
    },
    startTime: {
      type: String, // stored as "HH:mm" to keep timezone handling simple client-side
      required: [true, 'Start time is required'],
    },
    endTime: {
      type: String,
    },
    registrationDeadline: {
      type: Date,
      required: [true, 'Registration deadline is required'],
      validate: {
        validator: function validateDeadline(value) {
          return value < this.eventDate;
        },
        message: 'Registration deadline must be before the event date',
      },
    },
    capacity: {
      type: Number,
      required: [true, 'Capacity is required'],
      min: [1, 'Capacity must be at least 1'],
    },
    seatsBooked: {
      type: Number,
      default: 0,
      min: 0,
    },
    ticketPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(EVENT_STATUS),
      default: EVENT_STATUS.PUBLISHED,
    },
    tags: [{ type: String, trim: true }],
  },
  { timestamps: true }
);

eventSchema.index({ title: 'text', venue: 'text', category: 'text' });
eventSchema.index({ eventDate: 1 });
eventSchema.index({ organizer: 1 });
eventSchema.index({ status: 1 });

eventSchema.virtual('seatsLeft').get(function seatsLeft() {
  return Math.max(this.capacity - this.seatsBooked, 0);
});

eventSchema.virtual('isFull').get(function isFull() {
  return this.seatsBooked >= this.capacity;
});

eventSchema.virtual('isPast').get(function isPast() {
  return this.eventDate < new Date();
});

eventSchema.set('toJSON', { virtuals: true });
eventSchema.set('toObject', { virtuals: true });

// Slugs are derived from the title but suffixed with a short random string
// so two events named "Tech Meetup" don't collide.
eventSchema.pre('validate', function generateSlug(next) {
  if (this.isModified('title') || !this.slug) {
    const suffix = Math.random().toString(36).slice(2, 8);
    this.slug = `${slugify(this.title, { lower: true, strict: true })}-${suffix}`;
  }
  next();
});

module.exports = mongoose.model('Event', eventSchema);
