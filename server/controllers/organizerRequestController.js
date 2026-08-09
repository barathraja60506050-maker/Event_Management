const path = require('path');
const OrganizerRequest = require('../models/OrganizerRequest');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { success } = require('../utils/apiResponse');

const getRelativeUploadPath = (uploadPath) => {
  if (!uploadPath) return '';
  const relativePath = path.relative(path.join(__dirname, '..'), uploadPath);
  return `/${relativePath.replace(/\\/g, '/').replace(/^uploads\//, 'uploads/')}`;
};

exports.createOrganizerRequest = catchAsync(async (req, res, next) => {
  if (req.user.role !== 'user') {
    return next(new AppError('Only regular users can request organizer access', 403));
  }

  const { fullName, email, purpose, contactNumber } = req.body;
  const idProofFile = req.files?.idProof?.[0];
  const passportPhotoFile = req.files?.passportPhoto?.[0];

  if (!fullName || !email || !purpose || !contactNumber) {
    return next(new AppError('Full name, email, contact number, and purpose are required', 400));
  }

  if (!idProofFile || !passportPhotoFile) {
    return next(new AppError('ID proof and passport-size photo are required', 400));
  }

  const organizerRequest = await OrganizerRequest.create({
    user: req.user._id,
    fullName,
    email,
    purpose,
    contactNumber,
    idProof: getRelativeUploadPath(idProofFile.path),
    passportPhoto: getRelativeUploadPath(passportPhotoFile.path),
    organizerId: `ORG-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
  });

  success(res, 201, {
    request: organizerRequest,
    message:
      'Your organizer request has been submitted. Our team will contact you shortly and follow up via your login email.',
  });
});

exports.getMyRequest = catchAsync(async (req, res) => {
  const request = await OrganizerRequest.findOne({ user: req.user._id }).sort('-createdAt');
  success(res, 200, { request: request || null });
});
