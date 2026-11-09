const mongoose = require("mongoose");
const Task = require("../models/task.model");

const isValidTaskId = (id) => mongoose.isObjectIdOrHexString(id);
const statuses = ["pending", "in-progress", "completed"];
const priorities = ["low", "medium", "high"];
const validateTask = ({ title, description, status, priority, dueDate }, partial = false) => {
    if (!partial || title !== undefined) {
        if (typeof title !== "string" || !title.trim() || title.trim().length > 200) return "Title must contain 1 to 200 characters";
    }
    if (description !== undefined && (typeof description !== "string" || description.length > 5000)) return "Description must not exceed 5000 characters";
    if (status !== undefined && !statuses.includes(status)) return "Status must be pending, in-progress, or completed";
    if (priority !== undefined && !priorities.includes(priority)) return "Priority must be low, medium, or high";
    if (dueDate !== undefined && dueDate !== null && dueDate !== "" && Number.isNaN(new Date(dueDate).getTime())) return "Due date must be a valid date";
    return null;
};

const createTask = async (req, res) => {
    try {
        const { title, description, status, priority, dueDate } = req.body || {};
        const validationError = validateTask({ title, description, status, priority, dueDate });
        if (validationError) return res.status(422).json({ message: validationError });

        const task = await Task.create({
            title: title.trim(),
            description,
            status,
            priority,
            dueDate: dueDate || undefined,
            user: req.user._id,
        });

        return res.status(201).json({
            message: "Task created successfully",
            task,
        });
    } catch (error) {
        if (error.name === "ValidationError" || error.name === "CastError") {
            return res.status(400).json({ message: "Invalid task data" });
        }

        return res.status(500).json({
            message: "Failed to create task",
        });
    }
};

const getMyTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user._id }).sort({
            createdAt: -1,
        });

        return res.status(200).json({
            message: "Tasks fetched successfully",
            tasks,
        });
    } catch (error) {
        console.error("Task listing failed:", error);
        return res.status(500).json({ message: "Failed to fetch tasks" });
    }
};

const getSingleTask = async (req, res) => {
    try {
        if (!isValidTaskId(req.params.id)) {
            return res.status(400).json({ message: "Invalid task id" });
        }

        const task = await Task.findOne({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found",
            });
        }

        return res.status(200).json({
            message: "Task fetched successfully",
            task,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to fetch task",
        });
    }
};

const updateTask = async (req, res) => {
    try {
        const { title, description, status, priority, dueDate } = req.body || {};

        if (!isValidTaskId(req.params.id)) {
            return res.status(400).json({ message: "Invalid task id" });
        }

        const validationError = validateTask({ title, description, status, priority, dueDate }, true);
        if (validationError) return res.status(422).json({ message: validationError });
        if (title === undefined && description === undefined && status === undefined && priority === undefined && dueDate === undefined) {
            return res.status(422).json({ message: "At least one task field is required" });
        }

        const task = await Task.findOne({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found",
            });
        }

        task.title = title !== undefined ? title.trim() : task.title;
        task.description =
            description !== undefined ? description : task.description;
        task.status = status !== undefined ? status : task.status;
        task.priority = priority !== undefined ? priority : task.priority;
        task.dueDate = dueDate === "" || dueDate === null ? undefined : dueDate ?? task.dueDate;

        await task.save();

        return res.status(200).json({
            message: "Task updated successfully",
            task,
        });
    } catch (error) {
        if (error.name === "ValidationError" || error.name === "CastError") {
            return res.status(400).json({ message: "Invalid task data" });
        }

        return res.status(500).json({
            message: "Failed to update task",
        });
    }
};

const deleteTask = async (req, res) => {
    try {
        if (!isValidTaskId(req.params.id)) {
            return res.status(400).json({ message: "Invalid task id" });
        }

        const task = await Task.findOne({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found",
            });
        }

        await task.deleteOne();

        return res.status(200).json({
            message: "Task deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to delete task",
        });
    }
};

module.exports = {
    createTask,
    getMyTasks,
    getSingleTask,
    updateTask,
    deleteTask,
};
