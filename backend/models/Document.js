const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  caseId: { type: mongoose.Schema.Types.ObjectId, ref: "Case" },
  filename: String,
  fileType: String,
  length: Number, // GridFS file length
  storageType: { type: String, enum: ["MongoDB", "Blockchain"], default: "MongoDB" },
  version: { type: Number, default: 1 },
  uploader: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  blockchainHash: String, // For Blockchain storage
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Document", documentSchema);
