 const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true }, // User's full name
  email: { type: String, required: true, unique: true }, // User's email (used for login)
  password: { type: String, required: true }, // Encrypted password
  role: { type: String, required: true }, // Role of the user (e.g., "partner", "lawyer", "client")
  created_at: { type: Date, default: Date.now }, // Timestamp of when the user was created
});

module.exports = mongoose.model('User', UserSchema);
