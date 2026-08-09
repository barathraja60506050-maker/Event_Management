// Lightweight operational error class. Throwing this anywhere inside a
// controller lets the central error handler know the message is safe to
// show to the client (as opposed to a raw stack trace from a bug).
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
