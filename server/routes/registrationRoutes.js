const express = require('express');
const { body } = require('express-validator');
const registrationController = require('../controllers/registrationController');
const { protect, restrictTo } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(protect);

router.post(
  '/',
  [
    body('eventId').isMongoId().withMessage('A valid event id is required'),
    body('attendeeName').trim().notEmpty().withMessage('Full name is required').isLength({ max: 80 }),
    body('attendeeEmail').trim().isEmail().withMessage('A valid email is required').normalizeEmail(),
    body('attendeePhone').trim().notEmpty().withMessage('A contact number is required').isLength({ max: 30 }),
    body('quantity')
      .isInt({ min: 1, max: 10 })
      .withMessage('Quantity must be between 1 and 10'),
  ],
  validate,
  registrationController.registerForEvent
);
router.get('/mine', registrationController.getMyRegistrations);
router.patch('/:id/cancel', registrationController.cancelRegistration);
router.get('/:id', registrationController.getRegistration);

router.get('/', restrictTo('admin'), registrationController.getAllRegistrations);

module.exports = router;
