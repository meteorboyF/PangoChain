const Document = require("../models/Document");
const Case = require("../models/Case");
const crypto = require("crypto");

// ➤ Upload a Document and create its metadata record
exports.uploadDocument = async (req, res) => {
  try {
    const { caseId } = req.params;
    const { storageType } = req.body;
    const uploader = req.user.id; // Get uploader ID securely from middleware

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    let blockchainHash = null;

    if (storageType === "Blockchain") {
      // Simulate blockchain hash by hashing the file's content
      blockchainHash = crypto.createHash("sha256").update(req.file.buffer).digest("hex");
    }

    const newDoc = new Document({
      caseId,
      filename: req.file.filename,
      originalName: req.file.originalname,
      fileId: req.file.id, // The ID from GridFS, crucial for retrieving the file later
      contentType: req.file.mimetype,
      size: req.file.size,
      storageType,
      uploader,
      blockchainHash,
    });

    await newDoc.save();

    res.status(201).json({ message: "File uploaded successfully", document: newDoc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error during file upload." });
  }
};

// ➤ Get all documents for a specific case
exports.getCaseDocuments = async (req, res) => {
  try {
    const docs = await Document.find({ caseId: req.params.caseId }).populate(
      "uploader",
      "name role"
    );
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ➤ Attach an existing document to a task
exports.attachDocumentToTask = async (req, res) => {
  try {
    const { caseId, taskId } = req.params;
    const { documentId } = req.body;

    const caseData = await Case.findById(caseId);
    if (!caseData) {
      return res.status(404).json({ error: "Case not found" });
    }

    const task = caseData.tasks.id(taskId);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    
    // Check if the document is already attached
    const docExists = task.documents.some(doc => doc.document.toString() === documentId);
    if (docExists) {
      return res.status(400).json({ error: "Document is already attached to this task." });
    }

    const version = task.documents.length + 1;
    task.documents.push({ document: documentId, version });
    await caseData.save();

    res.json({ message: "Document attached successfully", task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};