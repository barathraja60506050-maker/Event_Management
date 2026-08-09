const Certificate = require('../models/Certificate');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { success } = require('../utils/apiResponse');

exports.uploadCertificate = catchAsync(async (req, res, next) => {
  const { userId, eventId } = req.body;

  if (!req.file) {
    return next(new AppError('Please attach a certificate file', 400));
  }

  const certificate = await Certificate.create({
    user: userId,
    event: eventId,
    fileUrl: `/uploads/certificates/${req.file.filename}`,
    uploadedBy: req.user._id,
  });

  success(res, 201, { certificate });
});

exports.getMyCertificates = catchAsync(async (req, res) => {
  const certificates = await Certificate.find({ user: req.user._id })
    .populate('event', 'title eventDate')
    .sort('-issuedAt');

  success(res, 200, { certificates });
});

exports.getAllCertificates = catchAsync(async (req, res) => {
  const certificates = await Certificate.find()
    .populate('event', 'title')
    .populate('user', 'name email')
    .sort('-issuedAt');

  success(res, 200, { certificates });
});
