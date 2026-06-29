const jwt = require("jsonwebtoken");
const User = require("../models/User");

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, secretKey } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, email and password are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: "Email already registered" });

    // If secret key matches env var → register as BA
    const isBa = secretKey && secretKey === process.env.BA_SECRET_KEY;

    // Check if any BA exists already
    const baExists = await User.findOne({ role: "ba" });

    let role = "pending";
    let isApproved = false;

    if (isBa) {
      role = "ba";
      isApproved = true;
    } else if (!baExists) {
      // First ever user auto-becomes BA (for easy first-time setup)
      role = "ba";
      isApproved = true;
    }

    const user = await User.create({ name, email, password, role, isApproved });
    const token = signToken(user._id);

    res.status(201).json({
      success: true,
      message: role === "ba" ? "Registered as Business Analyst!" : "Registered! Waiting for BA approval.",
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, isApproved: user.isApproved },
    });
  } catch (err) { next(err); }
};

// POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: "Email and password required" });

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const token = signToken(user._id);
    res.status(200).json({
      success: true,
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, isApproved: user.isApproved },
    });
  } catch (err) { next(err); }
};

// GET /api/auth/me
exports.getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};
