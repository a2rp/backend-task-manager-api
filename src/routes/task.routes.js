const express = require("express");
const {
    createTask,
    getMyTasks,
    getSingleTask,
    updateTask,
    deleteTask,
} = require("../controllers/task.controller");
const protect = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/", protect, createTask);
router.get("/", protect, getMyTasks);
router.get("/:id", protect, getSingleTask);
router.put("/:id", protect, updateTask);
router.delete("/:id", protect, deleteTask);

module.exports = router;
