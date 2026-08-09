const express = require('express');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { uploadProfilePicture } = require('../middleware/upload');
const {
  registerRules,
  loginRules,
  updatePasswordRules,
  updateProfileRules,
} = require('../validators/authValidators');

const router = express.Router();

router.post('/register', registerRules, validate, authController.register);
router.post('/login', loginRules, validate, authController.login);
router.post('/logout', protect, authController.logout);

router.get('/me', protect, authController.getMe);
router.patch(
  '/me',
  protect,
  uploadProfilePicture.single('avatar'),
  updateProfileRules,
  validate,
  authController.updateMe
);
router.patch('/update-password', protect, updatePasswordRules, validate, authController.updatePassword);

module.exports = router;
