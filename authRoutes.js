const express = require("express");

const router = express.Router();

const authController = require("../controllers/auth_controller");

// Register
router.post("/register", authController.register);

// Login
router.post("/login", authController.login);

module.exports = router;