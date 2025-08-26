const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  caseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Case', required: true }, // The case the document is related to
  fileName: { type: String, required: true }, // Name of the uploaded document
  filePath: { type: String, required: true }, // File path or URL to the stored document
  fileType: { type: String, required: true }, // e.g., "pdf", "docx", "jpg"
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User who uploaded the file
  uploadedAt: { type: Date, default: Date.now }, // When the document was uploaded
});

module.exports = mongoose.model('Document', DocumentSchema);
