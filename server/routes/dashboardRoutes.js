const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/summary', dashboardController.getSummary);
router.get('/admin-analytics', restrictTo('admin'), dashboardController.getAdminAnalytics);

module.exports = router;
