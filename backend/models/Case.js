const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: {
    type: String,
    enum: ["To Do", "In Progress", "Done"],
    default: "To Do",
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // User model
  },
  documents: [
    {
      document: { type: mongoose.Schema.Types.ObjectId, ref: "Document" },
      version: { type: Number, default: 1 },
      uploadedAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const caseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  tasks: [taskSchema], // Embedded tasks
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Case", caseSchema);
