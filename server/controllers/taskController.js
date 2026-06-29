const Task = require("../models/Task");

// GET /api/tasks
exports.getAllTasks = async (req, res, next) => {
  try {
    const { status, priority, category, sort, search } = req.query;
    const filter = {};

    // ROLE-BASED FILTERING:
    // BA sees ALL tasks. Employee sees ONLY tasks assigned to them.
    if (req.user.role === "employee") {
      filter.assignedTo = req.user._id;
    }

    if (status && status !== "all") filter.status = status;
    if (priority && priority !== "all") filter.priority = priority;
    if (category && category !== "all") filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === "oldest") sortOption = { createdAt: 1 };
    else if (sort === "due-asc") sortOption = { dueDate: 1 };
    else if (sort === "due-desc") sortOption = { dueDate: -1 };
    else if (sort === "title-asc") sortOption = { title: 1 };
    else if (sort === "title-desc") sortOption = { title: -1 };

    let tasks;
    if (sort === "priority") {
      tasks = await Task.aggregate([
        { $match: filter },
        { $addFields: { priorityOrder: { $switch: { branches: [
          { case: { $eq: ["$priority", "high"] }, then: 1 },
          { case: { $eq: ["$priority", "medium"] }, then: 2 },
          { case: { $eq: ["$priority", "low"] }, then: 3 },
        ], default: 4 } } } },
        { $sort: { priorityOrder: 1, createdAt: -1 } },
        { $project: { priorityOrder: 0 } },
      ]);
    } else {
      tasks = await Task.find(filter).sort(sortOption).populate("assignedTo", "name email");
    }

    // Stats scoped to the same filter (minus status)
    const { status: _s, ...statsFilter } = filter;
    const stats = await Task.aggregate([
      { $match: statsFilter },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const statusCounts = { todo: 0, "in-progress": 0, completed: 0, total: 0 };
    stats.forEach(({ _id, count }) => { statusCounts[_id] = count; statusCounts.total += count; });

    res.status(200).json({ success: true, count: tasks.length, stats: statusCounts, data: tasks });
  } catch (err) { next(err); }
};

// POST /api/tasks — BA only
exports.createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate, category, tags, imageUrl, assignedTo, assignedToName } = req.body;
    const task = await Task.create({
      title, description, status, priority,
      dueDate: dueDate || null,
      category: category || "General",
      tags: tags || [],
      imageUrl: imageUrl || "",
      assignedTo: assignedTo || null,
      assignedToName: assignedToName || "",
      createdBy: req.user._id,
      createdByName: req.user.name,
    });
    res.status(201).json({ success: true, message: "Task created", data: task });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ success: false, message: Object.values(err.errors).map(e => e.message).join(", ") });
    }
    next(err);
  }
};

// PUT /api/tasks/:id — BA only
exports.updateTask = async (req, res, next) => {
  try {
    const existing = await Task.findById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: "Task not found" });

    // BA-only: can't remove "completed" status unless you're BA (enforced in route)
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, message: "Task updated", data: task });
  } catch (err) { next(err); }
};

// PATCH /api/tasks/:id/status
exports.updateTaskStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed = ["todo", "in-progress", "completed"];
    if (!allowed.includes(status)) return res.status(400).json({ success: false, message: "Invalid status" });

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });

    // RULE: Only BA can mark as completed OR remove completed status
    if (status === "completed" && req.user.role !== "ba") {
      return res.status(403).json({ success: false, message: "Only Business Analyst can mark tasks as completed." });
    }
    if (task.status === "completed" && req.user.role !== "ba") {
      return res.status(403).json({ success: false, message: "Only Business Analyst can change a completed task's status." });
    }

    task.status = status;
    if (status === "completed") { task.completedAt = new Date(); task.completedBy = req.user._id; }
    else { task.completedAt = null; task.completedBy = null; }
    await task.save();

    res.status(200).json({ success: true, message: `Task marked as ${status}`, data: task });
  } catch (err) { next(err); }
};

// DELETE /api/tasks/:id — BA only
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });
    res.status(200).json({ success: true, message: "Task deleted", data: {} });
  } catch (err) { next(err); }
};

// DELETE /api/tasks/completed/all — BA only
exports.deleteCompletedTasks = async (req, res, next) => {
  try {
    const result = await Task.deleteMany({ status: "completed" });
    res.status(200).json({ success: true, message: `${result.deletedCount} completed tasks deleted` });
  } catch (err) { next(err); }
};

// GET /api/tasks/categories/all
exports.getCategories = async (req, res, next) => {
  try {
    const filter = req.user.role === "employee" ? { assignedTo: req.user._id } : {};
    const categories = await Task.distinct("category", filter);
    res.status(200).json({ success: true, data: categories });
  } catch (err) { next(err); }
};

// POST /api/tasks/:id/queries — Employee or BA adds a query/comment
exports.addQuery = async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message?.trim()) return res.status(400).json({ success: false, message: "Message cannot be empty" });

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });

    // Employee can only query their own assigned task
    if (req.user.role === "employee" && String(task.assignedTo) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: "You can only comment on tasks assigned to you" });
    }

    task.queries.push({
      author: req.user._id,
      authorName: req.user.name,
      authorRole: req.user.role,
      message: message.trim(),
    });
    await task.save();

    res.status(201).json({ success: true, message: "Query added", data: task.queries });
  } catch (err) { next(err); }
};
