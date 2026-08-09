const User = require('../models/User');
const OrganizerRequest = require('../models/OrganizerRequest');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { success } = require('../utils/apiResponse');

function issueToken(user, statusCode, res) {
  const token = user.generateAuthToken();
  success(res, statusCode, { token, user: user.toSafeObject() });
}

exports.register = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    return next(new AppError('An account with this email already exists', 409));
  }

  // Role is intentionally NOT taken from the request body — anyone could
  // otherwise self-register as admin. Elevation happens via the admin panel.
  const user = await User.create({ name, email, password });

  issueToken(user, 201, res);
});

const DAY_MS = 24 * 60 * 60 * 1000;

async function promoteApprovedOrganizerRequest(user) {
  if (user.role !== 'user') return user;

  const cutoff = new Date(Date.now() - DAY_MS);
  const request = await OrganizerRequest.findOne({
    user: user._id,
    status: 'approved',
    $or: [
      { approvedAt: { $lte: cutoff } },
      { approvedAt: null, updatedAt: { $lte: cutoff } },
    ],
  }).sort({ approvedAt: -1, updatedAt: -1 });

  if (!request) return user;

  user.role = 'organizer';
  await user.save({ validateBeforeSave: false });
  return user;
}

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  if (!user.isActive) {
    return next(new AppError('This account has been deactivated. Contact an administrator.', 403));
  }

  await promoteApprovedOrganizerRequest(user);

  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  issueToken(user, 200, res);
});

// Stateless JWT: "logout" is a client-side concern (discard the token).
// This endpoint exists mainly so the frontend has a symmetrical call to
// make and a place to hook in token-blacklisting later if ever needed.
exports.logout = catchAsync(async (req, res) => {
  success(res, 200, { message: 'Logged out successfully' });
});

exports.getMe = catchAsync(async (req, res) => {
  success(res, 200, { user: req.user.toSafeObject() });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  const { name, phone, bio } = req.body;

  const updates = {};
  if (name !== undefined) updates.name = name;
  if (phone !== undefined) updates.phone = phone;
  if (bio !== undefined) updates.bio = bio;

  if (req.file) {
    updates.avatar = `/uploads/profiles/${req.file.filename}`;
  }

  const user = await User.findByIdAndUpdate(req.user.id, updates, {
    new: true,
    runValidators: true,
  });

  success(res, 200, { user: user.toSafeObject() });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id).select('+password');

  if (!(await user.comparePassword(currentPassword))) {
    return next(new AppError('Current password is incorrect', 401));
  }

  user.password = newPassword;
  await user.save();

  issueToken(user, 200, res);
});
