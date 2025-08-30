const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  caseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Case', required: true }, // The case related to the message
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // The user sending the message
  recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // The user receiving the message
  message: { type: String, required: true }, // The message content
  timestamp: { type: Date, default: Date.now }, // When the message was sent
});

module.exports = mongoose.model('Message', MessageSchema);
