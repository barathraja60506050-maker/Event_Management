const User = require('../models/User');
const OrganizerRequest = require('../models/OrganizerRequest');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { success } = require('../utils/apiResponse');

exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find().sort('-createdAt');
  success(res, 200, { users: users.map((u) => u.toSafeObject()) });
});

exports.updateUserRole = catchAsync(async (req, res, next) => {
  const { role } = req.body;

  if (!['user', 'organizer', 'admin'].includes(role)) {
    return next(new AppError('Invalid role', 400));
  }

  if (req.params.id === req.user._id.toString() && role !== 'admin') {
    return next(new AppError("You can't remove your own admin role", 400));
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  user.role = role;
  await user.save();

  success(res, 200, { user: user.toSafeObject() });
});

exports.getOrganizerRequests = catchAsync(async (req, res) => {
  const requests = await OrganizerRequest.find().sort('-createdAt').populate('user', 'name email role');
  success(res, 200, { requests });
});

exports.updateOrganizerRequestStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;

  if (!['pending', 'approved', 'rejected'].includes(status)) {
    return next(new AppError('Invalid status', 400));
  }

  const request = await OrganizerRequest.findById(req.params.id);
  if (!request) {
    return next(new AppError('Organizer request not found', 404));
  }

  request.status = status;
  request.approvedAt = status === 'approved' ? new Date() : null;
  await request.save();

  success(res, 200, { request });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  if (req.params.id === req.user._id.toString()) {
    return next(new AppError("You can't delete your own account here", 400));
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  await user.deleteOne();
  success(res, 200, { message: 'User deleted' });
});
