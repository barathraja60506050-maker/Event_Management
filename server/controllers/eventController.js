const Event = require('../models/Event');
const Registration = require('../models/Registration');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { success } = require('../utils/apiResponse');
const { EVENT_STATUS } = require('../config/constants');

exports.createEvent = catchAsync(async (req, res, next) => {
  const event = await Event.create({
    ...req.body,
    organizer: req.user._id,
    banner: req.file ? `/uploads/events/${req.file.filename}` : '',
  });

  success(res, 201, { event });
});

// Handles search (text on title/venue/category), category filter,
// timeframe (upcoming/past), sorting and pagination all in one place —
// this is the endpoint the Events browse page and Home page both hit.
exports.getEvents = catchAsync(async (req, res) => {
  const { search, category, timeframe, sort = 'eventDate', page = 1, limit = 12 } = req.query;

  const filter = { status: EVENT_STATUS.PUBLISHED };

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { venue: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } },
    ];
  }

  if (category) filter.category = category;

  if (timeframe === 'upcoming') filter.eventDate = { $gte: new Date() };
  if (timeframe === 'past') filter.eventDate = { $lt: new Date() };

  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.min(parseInt(limit, 10) || 12, 50);
  const skip = (pageNum - 1) * limitNum;

  const [events, total] = await Promise.all([
    Event.find(filter).populate('organizer', 'name email role').sort(sort).skip(skip).limit(limitNum),
    Event.countDocuments(filter),
  ]);

  success(res, 200, { events }, { page: pageNum, totalPages: Math.ceil(total / limitNum) || 1, total });
});

exports.getEventBySlug = catchAsync(async (req, res, next) => {
  const event = await Event.findOne({ slug: req.params.slug }).populate('organizer', 'name email role');

  if (!event) {
    return next(new AppError('Event not found', 404));
  }

  success(res, 200, { event });
});

exports.getMyEvents = catchAsync(async (req, res) => {
  const events = await Event.find({ organizer: req.user._id }).sort('-createdAt');
  success(res, 200, { events });
});

exports.updateEvent = catchAsync(async (req, res, next) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return next(new AppError('Event not found', 404));
  }

  if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError("You don't have permission to edit this event", 403));
  }

  Object.assign(event, req.body);
  if (req.file) event.banner = `/uploads/events/${req.file.filename}`;

  await event.save();
  success(res, 200, { event });
});

exports.deleteEvent = catchAsync(async (req, res, next) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return next(new AppError('Event not found', 404));
  }

  if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError("You don't have permission to delete this event", 403));
  }

  // clean up dependent registrations so we don't leave orphaned tickets around
  await Registration.deleteMany({ event: event._id });
  await event.deleteOne();

  success(res, 200, { message: 'Event deleted' });
});
