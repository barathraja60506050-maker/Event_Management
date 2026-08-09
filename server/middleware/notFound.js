const AppError = require('../utils/AppError');

module.exports = function notFound(req, res, next) {
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
};
