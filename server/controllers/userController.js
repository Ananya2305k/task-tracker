const User = require("../models/User");

// GET /api/users/pending — BA sees all pending users
exports.getPendingUsers = async (req, res, next) => {
  try {
    const users = await User.find({ role: "pending", isApproved: false }).select("-password");
    res.json({ success: true, data: users });
  } catch (err) { next(err); }
};

// GET /api/users/employees — BA gets list of approved employees (for assigning tasks)
exports.getEmployees = async (req, res, next) => {
  try {
    const employees = await User.find({ role: "employee", isApproved: true }).select("name email");
    res.json({ success: true, data: employees });
  } catch (err) { next(err); }
};

// PATCH /api/users/:id/approve — BA approves a pending user
exports.approveUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: "employee", isApproved: true, approvedBy: req.user._id },
      { new: true }
    ).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, message: `${user.name} approved as Employee`, data: user });
  } catch (err) { next(err); }
};

// PATCH /api/users/:id/reject — BA rejects/removes a pending user
exports.rejectUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "User removed" });
  } catch (err) { next(err); }
};

// GET /api/users/all — BA sees all users
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ role: { $ne: "ba" } }).select("-password");
    res.json({ success: true, data: users });
  } catch (err) { next(err); }
};
