const { body } = require('express-validator');

exports.registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 60 }),
  body('email').trim().isEmail().withMessage('A valid email is required').normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/\d/)
    .withMessage('Password must contain at least one number'),
];

exports.loginRules = [
  body('email').trim().isEmail().withMessage('A valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

exports.updatePasswordRules = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters')
    .matches(/\d/)
    .withMessage('New password must contain at least one number'),
];

exports.updateProfileRules = [
  body('name').optional().trim().isLength({ max: 60 }),
  body('phone').optional().trim().isLength({ max: 20 }),
  body('bio').optional().trim().isLength({ max: 300 }),
];
