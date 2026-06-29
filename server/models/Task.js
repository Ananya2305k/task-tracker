const mongoose = require("mongoose");

// Sub-schema for comments/queries
const querySchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  authorName: { type: String, required: true },
  authorRole: { type: String, required: true },
  message: { type: String, required: true, maxlength: 1000 },
}, { timestamps: true });

const taskSchema = new mongoose.Schema({
  title: { type: String, required: [true, "Title is required"], trim: true, maxlength: 100 },
  description: { type: String, trim: true, maxlength: 1000, default: "" },
  status: { type: String, enum: ["todo", "in-progress", "completed"], default: "todo" },
  priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
  dueDate: { type: Date, default: null },
  category: { type: String, trim: true, default: "General" },
  tags: { type: [String], default: [] },

  // Image URL (screenshot of bug from client)
  imageUrl: { type: String, default: "" },

  // Who this task is assigned to (employee)
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  assignedToName: { type: String, default: "" },

  // Who created this task (BA)
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdByName: { type: String, required: true },

  // Queries / comments thread
  queries: [querySchema],

  // Only BA can mark as completed AND only BA can un-complete
  completedAt: { type: Date, default: null },
  completedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },

}, { timestamps: true });

taskSchema.index({ title: "text", description: "text" });

module.exports = mongoose.model("Task", taskSchema);
