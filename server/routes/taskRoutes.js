const express = require("express");
const router = express.Router();
const {
  getAllTasks, createTask, updateTask, updateTaskStatus,
  deleteTask, deleteCompletedTasks, getCategories, addQuery
} = require("../controllers/taskController");
const { protect, approvedOnly, baOnly } = require("../middleware/auth");

router.use(protect, approvedOnly);

router.get("/categories/all", getCategories);
router.delete("/completed/all", baOnly, deleteCompletedTasks);

router.route("/")
  .get(getAllTasks)
  .post(baOnly, createTask);

router.route("/:id")
  .put(baOnly, updateTask)
  .delete(baOnly, deleteTask);

router.patch("/:id/status", updateTaskStatus);
router.post("/:id/queries", addQuery);

module.exports = router;
