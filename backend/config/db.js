 const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // IMPROVEMENT: Removed deprecated options. The latest Mongoose handles this automatically.
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;