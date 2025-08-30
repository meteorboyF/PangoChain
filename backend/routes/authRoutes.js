const express = require("express");
const { register, login } = require("../controllers/authController");  // Correctly import the controller functions
const router = express.Router();

// Route to register a new user
router.post("/register", register);  // register function from authController

// Route to log in a user
router.post("/login", login);  // login function from authController

module.exports = router;  // Export the router for use in server.js
