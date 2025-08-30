const mongoose = require('mongoose');

const CaseSchema = new mongoose.Schema({
  title: { type: String, required: true, index: true }, // Title of the case
  description: { type: String }, // Detailed description of the case
  clientName: { type: String, index: true }, // Client name (instead of requiring ObjectId)
  caseType: { type: String, default: 'General', index: true }, // Type of case
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true }, // Optional client reference
  lawyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true }, // Optional lawyer reference
  status: { type: String, default: 'active', index: true }, // active, closed, pending
  createdAt: { type: Date, default: Date.now, index: true }, // When the case was created
  updatedAt: { type: Date, default: Date.now, index: true }, // When the case was last updated
});

// Add compound indexes for common queries
CaseSchema.index({ status: 1, createdAt: -1 });
CaseSchema.index({ lawyerId: 1, status: 1 });
CaseSchema.index({ clientId: 1, status: 1 });
CaseSchema.index({ caseType: 1, status: 1 });

// Add text search index
CaseSchema.index({ 
  title: 'text', 
  description: 'text', 
  clientName: 'text' 
}, { 
  weights: { 
    title: 10, 
    clientName: 5, 
    description: 1 
  } 
});

module.exports = mongoose.model('Case', CaseSchema);
