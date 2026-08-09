const express = require('express');
const eventController = require('../controllers/eventController');
const { protect, restrictTo, attachUserIfPresent } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { uploadEventBanner } = require('../middleware/upload');
const { createEventRules, updateEventRules, listEventsRules } = require('../validators/eventValidators');

const router = express.Router();

router.get('/', listEventsRules, validate, attachUserIfPresent, eventController.getEvents);
router.get('/mine', protect, restrictTo('organizer', 'admin'), eventController.getMyEvents);
router.get('/:slug', eventController.getEventBySlug);

router.post(
  '/',
  protect,
  restrictTo('organizer', 'admin'),
  uploadEventBanner.single('banner'),
  createEventRules,
  validate,
  eventController.createEvent
);

router.patch(
  '/:id',
  protect,
  restrictTo('organizer', 'admin'),
  uploadEventBanner.single('banner'),
  updateEventRules,
  validate,
  eventController.updateEvent
);

router.delete('/:id', protect, restrictTo('organizer', 'admin'), eventController.deleteEvent);

module.exports = router;
