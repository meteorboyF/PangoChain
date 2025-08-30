const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema({
  action: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  caseId: { type: mongoose.Schema.Types.ObjectId, ref: "Case" },
  description: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("AuditLog", auditLogSchema);
