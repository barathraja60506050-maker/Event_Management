const express = require('express');
const { body } = require('express-validator');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { uploadOrganizerRequest } = require('../middleware/upload');
const organizerRequestController = require('../controllers/organizerRequestController');

const router = express.Router();

router.get('/me', protect, organizerRequestController.getMyRequest);

router.post(
  '/',
  protect,
  uploadOrganizerRequest.fields([
    { name: 'idProof', maxCount: 1 },
    { name: 'passportPhoto', maxCount: 1 },
  ]),
  [
    body('fullName').trim().notEmpty().withMessage('Full name is required').isLength({ max: 100 }),
    body('email').trim().isEmail().withMessage('A valid email is required'),
    body('contactNumber').trim().notEmpty().withMessage('Contact number is required').isLength({ max: 30 }),
    body('purpose').trim().notEmpty().withMessage('Purpose is required').isLength({ max: 2000 }),
  ],
  validate,
  organizerRequestController.createOrganizerRequest
);

module.exports = router;
