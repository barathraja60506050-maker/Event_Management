// Single source of truth for enums used across models, controllers and
// validators. Importing from here instead of hardcoding strings prevents
// typos like "organiser" vs "organizer" from creeping into the codebase.

const ROLES = Object.freeze({
  ADMIN: 'admin',
  ORGANIZER: 'organizer',
  USER: 'user',
});

const EVENT_STATUS = Object.freeze({
  DRAFT: 'draft',
  PUBLISHED: 'published',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
});

const REGISTRATION_STATUS = Object.freeze({
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  ATTENDED: 'attended',
});

const PAYMENT_STATUS = Object.freeze({
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed',
  REFUNDED: 'refunded',
});

const NOTIFICATION_TYPES = Object.freeze({
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
});

module.exports = {
  ROLES,
  EVENT_STATUS,
  REGISTRATION_STATUS,
  PAYMENT_STATUS,
  NOTIFICATION_TYPES,
};
