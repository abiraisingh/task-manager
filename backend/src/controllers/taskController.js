const Task = require("../models/Task");

// CREATE
exports.createTask = async (req, res) => {
  try {
    const task = await Task.create({
      ...req.body,
      user: req.user.id
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// GET (ROLE-BASED)
exports.getTasks = async (req, res) => {
  try {
    let filter = {};

    // user → only own tasks
    if (req.user.role !== "admin") {
      filter.user = req.user.id;
    }

    const tasks = await Task.find(filter);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// UPDATE
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    // ownership check
    if (req.user.role !== "admin" && task.user.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not allowed" });
    }

    Object.assign(task, req.body);
    await task.save();

    res.json(task);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// DELETE
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    if (req.user.role !== "admin" && task.user.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not allowed" });
    }

    await task.deleteOne();

    res.json({ msg: "Task deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};