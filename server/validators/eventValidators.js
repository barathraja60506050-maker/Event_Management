const { body, query } = require('express-validator');

exports.createEventRules = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 120 }),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('venue').trim().notEmpty().withMessage('Venue is required'),
  body('eventDate').isISO8601().toDate().withMessage('A valid event date is required'),
  body('startTime').notEmpty().withMessage('Start time is required'),
  body('registrationDeadline')
    .isISO8601()
    .toDate()
    .withMessage('A valid registration deadline is required'),
  body('capacity').isInt({ min: 1 }).withMessage('Capacity must be a positive number'),
  body('ticketPrice').optional().isFloat({ min: 0 }).withMessage('Ticket price cannot be negative'),
];

exports.updateEventRules = [
  body('title').optional().trim().isLength({ max: 120 }),
  body('description').optional().trim(),
  body('category').optional().trim(),
  body('venue').optional().trim(),
  body('eventDate').optional().isISO8601().toDate(),
  body('registrationDeadline').optional().isISO8601().toDate(),
  body('capacity').optional().isInt({ min: 1 }),
  body('ticketPrice').optional().isFloat({ min: 0 }),
];

exports.listEventsRules = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('sort').optional().isString(),
];
