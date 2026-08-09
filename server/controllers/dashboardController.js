const Event = require('../models/Event');
const Registration = require('../models/Registration');
const Certificate = require('../models/Certificate');
const User = require('../models/User');
const Payment = require('../models/Payment');
const catchAsync = require('../utils/catchAsync');
const { success } = require('../utils/apiResponse');
const { REGISTRATION_STATUS } = require('../config/constants');

// Powers the logged-in user's dashboard: upcoming/registered counts,
// certificates earned, and the list of events they're registered for.
exports.getSummary = catchAsync(async (req, res) => {
  const userRegistrations = await Registration.find({
    user: req.user._id,
    status: { $ne: REGISTRATION_STATUS.CANCELLED },
  }).populate('event');

  const registeredEvents = userRegistrations.map((r) => r.event).filter(Boolean);
  const upcomingCount = registeredEvents.filter((e) => e.eventDate > new Date()).length;

  let registeredCount = registeredEvents.length;
  let organizerRegistrations = [];

  if (req.user.role === 'organizer') {
    // Count registrations for events created by this organizer only.
    organizerRegistrations = await Registration.find({
      status: { $ne: REGISTRATION_STATUS.CANCELLED },
    }).populate({ path: 'event', match: { organizer: req.user._id } });

    const validOrganizerRegs = organizerRegistrations.filter((reg) => reg.event);
    registeredCount = validOrganizerRegs.length;
  }

  const certificateCount = await Certificate.countDocuments({ user: req.user._id });

  success(res, 200, {
    upcomingCount,
    registeredCount,
    certificateCount,
    recentActivityCount: userRegistrations.length,
    registeredEvents,
    organizerRegistrations: organizerRegistrations.filter((reg) => reg.event).map((reg) => reg.event),
  });
});

// Powers the admin overview page.
exports.getAdminAnalytics = catchAsync(async (req, res) => {
  const [totalUsers, totalEvents, totalRegistrations, revenueAgg] = await Promise.all([
    User.countDocuments(),
    Event.countDocuments(),
    Registration.countDocuments({ status: { $ne: REGISTRATION_STATUS.CANCELLED } }),
    Payment.aggregate([{ $match: { status: 'success' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
  ]);

  success(res, 200, {
    totalUsers,
    totalEvents,
    totalRegistrations,
    totalRevenue: revenueAgg[0]?.total ?? 0,
  });
});
