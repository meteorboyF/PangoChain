const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/authMiddleware");
const {
  uploadDocument,
  getCaseDocuments,
  attachDocumentToTask,
} = require("../controllers/documentController");

// All document routes are protected and require a valid token
router.post("/:caseId/upload", authMiddleware, upload.single("file"), uploadDocument);
router.get("/:caseId", authMiddleware, getCaseDocuments);
router.post("/:caseId/tasks/:taskId/attach", authMiddleware, attachDocumentToTask);

module.exports = router;