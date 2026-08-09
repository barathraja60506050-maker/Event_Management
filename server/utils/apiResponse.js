// Keeps every controller returning the same envelope shape so the frontend
// axios interceptor can rely on `response.data.data` unconditionally.
exports.success = (res, statusCode, data, meta = undefined) => {
  const payload = { success: true, data };
  if (meta) payload.meta = meta;
  return res.status(statusCode).json(payload);
};
