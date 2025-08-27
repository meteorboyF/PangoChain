const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
  action: { type: String, required: true }, // e.g., "User Registered"
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Refers to the user performing the action
  timestamp: { type: Date, default: Date.now }, // Timestamp of the action
  description: { type: String }, // Additional details about the action
});

module.exports = mongoose.model('AuditLog', AuditLogSchema);
