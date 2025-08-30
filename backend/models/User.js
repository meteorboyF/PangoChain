 const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true }, // User's full name
  email: { type: String, required: true, unique: true, index: true }, // User's email (used for login)
  password: { type: String, required: true }, // Encrypted password
  role: { type: String, required: true, index: true }, // Role of the user (e.g., "partner", "lawyer", "client")
  createdAt: { type: Date, default: Date.now, index: true }, // Timestamp of when the user was created
});

// Add compound indexes for common queries
UserSchema.index({ email: 1, role: 1 });
UserSchema.index({ createdAt: -1 });

module.exports = mongoose.model('User', UserSchema);
