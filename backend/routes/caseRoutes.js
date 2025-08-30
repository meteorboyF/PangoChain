const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createCase,
  getCases,
  addTask,
  updateTaskStatus,
  assignTask,
} = require("../controllers/caseController");

// All case routes are protected and require a valid token
router.post("/", authMiddleware, createCase);
router.get("/", authMiddleware, getCases);
router.post("/:caseId/tasks", authMiddleware, addTask);
router.put("/:caseId/tasks/:taskId/status", authMiddleware, updateTaskStatus);
router.put("/:caseId/tasks/:taskId/assign", authMiddleware, assignTask);

module.exports = router;