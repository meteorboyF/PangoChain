 const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json()); // to parse JSON body
app.use(cors());         // allow cross-origin requests

// Routes
app.use("/api/auth", require("./routes/authRoutes"));

// Root endpoint (for testing)
app.get("/", (req, res) => {
  res.send("✅ PangoChain Backend API is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
