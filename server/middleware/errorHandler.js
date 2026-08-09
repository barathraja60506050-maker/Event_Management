const AppError = require('../utils/AppError');

function handleCastErrorDB(err) {
  return new AppError(`Invalid ${err.path}: ${err.value}`, 400);
}

function handleDuplicateFieldsDB(err) {
  const field = Object.keys(err.keyValue || {})[0];
  const value = field ? err.keyValue[field] : 'value';
  return new AppError(`${field ? field.charAt(0).toUpperCase() + field.slice(1) : 'Field'} "${value}" is already in use`, 409);
}

function handleValidationErrorDB(err) {
  const messages = Object.values(err.errors).map((el) => el.message);
  return new AppError(`Invalid input: ${messages.join('. ')}`, 400);
}

function handleJWTError() {
  return new AppError('Invalid authentication token. Please log in again.', 401);
}

function handleJWTExpiredError() {
  return new AppError('Your session has expired. Please log in again.', 401);
}

function sendDev(err, res) {
  res.status(err.statusCode || 500).json({
    success: false,
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
}

function sendProd(err, res) {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message,
    });
  }

  // Unexpected/programmer error: log it internally but don't leak details.
  console.error('UNEXPECTED ERROR 💥', err);
  return res.status(500).json({
    success: false,
    status: 'error',
    message: 'Something went wrong on our end. Please try again later.',
  });
}

module.exports = function globalErrorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    return sendDev(err, res);
  }

  let error = Object.assign(Object.create(Object.getPrototypeOf(err)), err);
  error.message = err.message;

  if (error.name === 'CastError') error = handleCastErrorDB(error);
  if (error.code === 11000) error = handleDuplicateFieldsDB(error);
  if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
  if (error.name === 'JsonWebTokenError') error = handleJWTError();
  if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

  sendProd(error, res);
};
