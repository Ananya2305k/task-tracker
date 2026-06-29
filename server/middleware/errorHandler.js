const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  if (err.name === "CastError") { statusCode = 400; message = "Invalid ID format"; }
  if (err.code === 11000) { statusCode = 400; message = "Email already registered"; }
  if (process.env.NODE_ENV === "development") console.error("❌", err);
  res.status(statusCode).json({ success: false, message });
};
module.exports = errorHandler;
