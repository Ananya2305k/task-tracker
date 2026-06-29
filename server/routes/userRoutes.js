const express = require("express");
const router = express.Router();
const { getPendingUsers, getEmployees, approveUser, rejectUser, getAllUsers } = require("../controllers/userController");
const { protect, baOnly } = require("../middleware/auth");

router.use(protect, baOnly);
router.get("/pending", getPendingUsers);
router.get("/employees", getEmployees);
router.get("/all", getAllUsers);
router.patch("/:id/approve", approveUser);
router.delete("/:id/reject", rejectUser);

module.exports = router;
