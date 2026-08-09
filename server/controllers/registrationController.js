const Registration = require('../models/Registration');
const Event = require('../models/Event');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { success } = require('../utils/apiResponse');
const { generateTicketQR } = require('../services/qrService');
const { REGISTRATION_STATUS } = require('../config/constants');

exports.registerForEvent = catchAsync(async (req, res, next) => {
  const { eventId, attendeeName, attendeeEmail, attendeePhone, quantity } = req.body;
  const requestedQuantity = Number(quantity) || 1;

  const event = await Event.findById(eventId);
  if (!event) {
    return next(new AppError('Event not found', 404));
  }

  if (event.registrationDeadline < new Date()) {
    return next(new AppError('Registration for this event has closed', 400));
  }

  if (requestedQuantity > 10) {
    return next(new AppError('You can register for a maximum of 10 tickets per event', 400));
  }

  if (event.seatsBooked + requestedQuantity > event.capacity) {
    return next(new AppError('Not enough seats available for this quantity', 400));
  }

  const existing = await Registration.findOne({
    user: req.user._id,
    event: event._id,
    status: { $ne: REGISTRATION_STATUS.CANCELLED },
  });
  if (existing) {
    return next(new AppError('You are already registered for this event', 409));
  }

  const registration = await Registration.create({
    user: req.user._id,
    event: event._id,
    attendeeName,
    attendeeEmail,
    attendeePhone,
    quantity: requestedQuantity,
    status: event.ticketPrice > 0 ? REGISTRATION_STATUS.PENDING : REGISTRATION_STATUS.CONFIRMED,
  });

  if (registration.status === REGISTRATION_STATUS.CONFIRMED) {
    const qrPath = await generateTicketQR({
      ticketNumber: registration.ticketNumber,
      eventId: event._id.toString(),
      userId: req.user._id.toString(),
      registrationId: registration._id.toString(),
      eventTitle: event.title,
      eventVenue: event.venue,
      eventDate: event.eventDate?.toISOString(),
      startTime: event.startTime,
      attendeeName,
      attendeeEmail,
      attendeePhone,
      quantity: registration.quantity,
      paymentMethod: 'free',
      amount: 0,
      status: registration.status,
      receiptNumber: null,
    });
    registration.qrCode = qrPath;
    await registration.save();
  }

  event.seatsBooked += requestedQuantity;
  await event.save();

  await registration.populate('event');
  success(res, 201, { registration });
});

exports.getRegistration = catchAsync(async (req, res, next) => {
  const registration = await Registration.findById(req.params.id)
    .populate('event')
    .populate('payment');

  if (!registration) {
    return next(new AppError('Registration not found', 404));
  }

  if (registration.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError("You don't have permission to view this registration", 403));
  }

  success(res, 200, { registration });
});

exports.getMyRegistrations = catchAsync(async (req, res) => {
  const registrations = await Registration.find({ user: req.user._id })
    .populate('event')
    .populate('payment')
    .sort('-createdAt');

  success(res, 200, { registrations });
});

exports.cancelRegistration = catchAsync(async (req, res, next) => {
  const registration = await Registration.findById(req.params.id);

  if (!registration) {
    return next(new AppError('Registration not found', 404));
  }

  if (registration.user.toString() !== req.user._id.toString()) {
    return next(new AppError("You can't cancel someone else's registration", 403));
  }

  if (registration.status === REGISTRATION_STATUS.CANCELLED) {
    return next(new AppError('This registration is already cancelled', 400));
  }

  registration.status = REGISTRATION_STATUS.CANCELLED;
  registration.cancelledAt = new Date();
  await registration.save();

  await Event.findByIdAndUpdate(registration.event, { $inc: { seatsBooked: -1 } });

  success(res, 200, { message: 'Registration cancelled' });
});

// used by the admin "Manage Registrations" panel
exports.getAllRegistrations = catchAsync(async (req, res) => {
  const registrations = await Registration.find()
    .populate('event', 'title eventDate')
    .populate('user', 'name email')
    .sort('-createdAt');

  success(res, 200, { registrations });
});
