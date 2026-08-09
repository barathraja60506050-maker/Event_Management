// Wraps an async controller so any rejected promise is forwarded to
// Express's error-handling middleware instead of crashing the process.
module.exports = function catchAsync(fn) {
  return function wrapped(req, res, next) {
    fn(req, res, next).catch(next);
  };
};
