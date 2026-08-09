const Payment = require('../models/Payment');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { success } = require('../utils/apiResponse');
const { generateTicketQR } = require('../services/qrService');
const { PAYMENT_STATUS, REGISTRATION_STATUS } = require('../config/constants');

// This is a demo payment flow: no real payment gateway is called. It
// simulates a successful charge and immediately marks the payment as
// paid, so the frontend can show a "Payment Success" screen and receipt.
exports.pay = catchAsync(async (req, res, next) => {
  const { registrationId, method = 'card' } = req.body;

  const registration = await Registration.findById(registrationId).populate('event');
  if (!registration) {
    return next(new AppError('Registration not found', 404));
  }

  if (registration.user.toString() !== req.user._id.toString()) {
    return next(new AppError("You don't have permission to pay for this registration", 403));
  }

  if (registration.status === REGISTRATION_STATUS.CONFIRMED) {
    return next(new AppError('This registration is already confirmed', 400));
  }

  if (registration.status === REGISTRATION_STATUS.CANCELLED) {
    return next(new AppError('This registration has been cancelled', 400));
  }

  const event = registration.event;
  if (!event) {
    return next(new AppError('Event not found', 404));
  }

  const amount = (registration.quantity || 1) * event.ticketPrice;

  const payment = await Payment.create({
    user: req.user._id,
    event: event._id,
    registration: registration._id,
    amount,
    method: amount > 0 ? method : 'free',
    status: PAYMENT_STATUS.SUCCESS,
    paidAt: new Date(),
    receiptNumber: `RCPT-${Date.now().toString(36).toUpperCase()}`,
  });

  registration.status = REGISTRATION_STATUS.CONFIRMED;
  registration.payment = payment._id;

  if (!registration.qrCode) {
    const qrPath = await generateTicketQR({
      ticketNumber: registration.ticketNumber,
      eventId: event._id.toString(),
      userId: req.user._id.toString(),
      registrationId: registration._id.toString(),
      eventTitle: event.title,
      eventVenue: event.venue,
      eventDate: event.eventDate.toISOString(),
      startTime: event.startTime,
      attendeeName: registration.attendeeName,
      attendeeEmail: registration.attendeeEmail,
      attendeePhone: registration.attendeePhone,
      quantity: registration.quantity,
      paymentMethod: method,
      amount,
      status: registration.status,
      receiptNumber: payment.receiptNumber,
    });
    registration.qrCode = qrPath;
  }

  await registration.save();
  await registration.populate('event');
  await registration.populate('payment');

  success(res, 201, { payment, registration });
});

exports.getReceipt = catchAsync(async (req, res, next) => {
  const payment = await Payment.findById(req.params.id).populate('event', 'title venue eventDate').populate('user', 'name email');

  if (!payment) {
    return next(new AppError('Payment not found', 404));
  }

  if (payment.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError("You don't have permission to view this receipt", 403));
  }

  success(res, 200, { payment });
});

// used by the admin "View Payments" panel
exports.getAllPayments = catchAsync(async (req, res) => {
  const payments = await Payment.find()
    .populate('event', 'title')
    .populate('user', 'name email')
    .sort('-createdAt');

  success(res, 200, { payments });
});
