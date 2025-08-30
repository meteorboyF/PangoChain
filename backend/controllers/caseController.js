const Case = require("../models/Case");

// ➤ Create Case
exports.createCase = async (req, res) => {
  try {
    const { title, description } = req.body;
    // The creator's ID is now taken securely from the authenticated user's token
    const createdBy = req.user.id;

    const newCase = new Case({ title, description, createdBy });
    await newCase.save();
    res.status(201).json(newCase);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ➤ Get All Cases
exports.getCases = async (req, res) => {
  try {
    const cases = await Case.find().populate("createdBy", "name role");
    res.json(cases);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ➤ Add Task to a Case
exports.addTask = async (req, res) => {
  try {
    const { title, description, assignedTo } = req.body;
    const caseData = await Case.findById(req.params.caseId);

    if (!caseData) {
        return res.status(404).json({ error: "Case not found." });
    }

    caseData.tasks.push({ title, description, assignedTo });
    await caseData.save();

    res.status(201).json(caseData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ➤ Update Task Status
exports.updateTaskStatus = async (req, res) => {
  try {
    const caseData = await Case.findById(req.params.caseId);
    const task = caseData.tasks.id(req.params.taskId);
    if (!task) return res.status(404).json({ error: "Task not found" });

    task.status = req.body.status;
    await caseData.save();

    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ➤ Assign Task
exports.assignTask = async (req, res) => {
  try {
    const caseData = await Case.findById(req.params.caseId);
    const task = caseData.tasks.id(req.params.taskId);
    if (!task) return res.status(404).json({ error: "Task not found" });

    task.assignedTo = req.body.userId;
    await caseData.save();

    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};