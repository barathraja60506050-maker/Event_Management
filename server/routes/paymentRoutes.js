const express = require('express');
const paymentController = require('../controllers/paymentController');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/', paymentController.pay);
router.get('/:id/receipt', paymentController.getReceipt);
router.get('/', restrictTo('admin'), paymentController.getAllPayments);

module.exports = router;
