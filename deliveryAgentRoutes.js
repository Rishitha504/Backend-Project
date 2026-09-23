const express = require("express");

const router = express.Router();

const {
    registerDeliveryAgent,
    loginDeliveryAgent
} = require("../controllers/delivery_agent_controller");

// Delivery agent registration
router.post("/register", registerDeliveryAgent);

// Delivery agent login
router.post("/login", loginDeliveryAgent);

module.exports = router;