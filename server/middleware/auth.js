const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Verify JWT token — protects all routes
exports.protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized, please login" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) return res.status(401).json({ success: false, message: "User no longer exists" });
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Invalid token, please login again" });
  }
};

// Only Business Analyst can access
exports.baOnly = (req, res, next) => {
  if (req.user.role !== "ba") {
    return res.status(403).json({ success: false, message: "Access denied. Business Analyst only." });
  }
  next();
};

// Only approved users (employee or ba)
exports.approvedOnly = (req, res, next) => {
  if (!req.user.isApproved) {
    return res.status(403).json({ success: false, message: "Your account is pending approval by the Business Analyst." });
  }
  next();
};
