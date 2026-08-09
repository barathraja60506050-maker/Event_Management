const express = require('express');
const certificateController = require('../controllers/certificateController');
const { protect, restrictTo } = require('../middleware/auth');
const { uploadCertificate } = require('../middleware/upload');

const router = express.Router();

router.use(protect);

router.get('/mine', certificateController.getMyCertificates);
router.post('/', restrictTo('organizer', 'admin'), uploadCertificate.single('certificate'), certificateController.uploadCertificate);
router.get('/', restrictTo('admin'), certificateController.getAllCertificates);

module.exports = router;
