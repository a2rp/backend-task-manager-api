const Task = require("../models/task.model");

const createTask = async (req, res) => {
    try {
        const { title, description, status, priority, dueDate } = req.body;

        if (!title) {
            return res.status(400).json({
                message: "Title is required",
            });
        }

        const task = await Task.create({
            title,
            description,
            status,
            priority,
            dueDate,
            user: req.user._id,
        });

        return res.status(201).json({
            message: "Task created successfully",
            task,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to create task",
            error: error.message,
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
        return res.status(500).json({
            message: "Failed to fetch tasks",
            error: error.message,
        });
    }
};

const getSingleTask = async (req, res) => {
    try {
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
            error: error.message,
        });
    }
};

const updateTask = async (req, res) => {
    try {
        const { title, description, status, priority, dueDate } = req.body;

        const task = await Task.findOne({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found",
            });
        }

        task.title = title || task.title;
        task.description =
            description !== undefined ? description : task.description;
        task.status = status || task.status;
        task.priority = priority || task.priority;
        task.dueDate = dueDate !== undefined ? dueDate : task.dueDate;

        await task.save();

        return res.status(200).json({
            message: "Task updated successfully",
            task,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to update task",
            error: error.message,
        });
    }
};

const deleteTask = async (req, res) => {
    try {
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
            error: error.message,
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
