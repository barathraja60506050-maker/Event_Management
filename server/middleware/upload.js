const path = require('path');
const fs = require('fs');
const multer = require('multer');
const AppError = require('../utils/AppError');

// Ensures the destination folder exists before multer tries to write to it
// (a fresh clone of the repo won't have empty upload dirs checked in).
function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function buildStorage(subfolder) {
  const destination = path.join(__dirname, '..', 'uploads', subfolder);
  ensureDir(destination);

  return multer.diskStorage({
    destination: (req, file, cb) => cb(null, destination),
    filename: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const ext = path.extname(file.originalname);
      cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
  });
}

const imageFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (allowed.includes(file.mimetype)) return cb(null, true);
  cb(new AppError('Only JPG, PNG and WEBP images are allowed', 400), false);
};

const documentFilter = (req, file, cb) => {
  const allowed = ['application/pdf', 'image/jpeg', 'image/png'];
  if (allowed.includes(file.mimetype)) return cb(null, true);
  cb(new AppError('Only PDF, JPG or PNG files are allowed', 400), false);
};

const uploadEventBanner = multer({
  storage: buildStorage('events'),
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

const uploadProfilePicture = multer({
  storage: buildStorage('profiles'),
  fileFilter: imageFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

const uploadCertificate = multer({
  storage: buildStorage('certificates'),
  fileFilter: documentFilter,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB
});

const uploadOrganizerRequest = multer({
  storage: buildStorage('organizer-requests'),
  fileFilter: documentFilter,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB
});

module.exports = { uploadEventBanner, uploadProfilePicture, uploadCertificate, uploadOrganizerRequest };
