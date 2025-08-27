const mongoose = require('mongoose');

const CaseSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Title of the case
  description: { type: String }, // Detailed description of the case
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // The client related to the case
  lawyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Lawyer assigned to the case
  status: { type: String, default: 'Open' }, // Open, In Progress, Closed
  created_at: { type: Date, default: Date.now }, // When the case was created
});

module.exports = mongoose.model('Case', CaseSchema);
