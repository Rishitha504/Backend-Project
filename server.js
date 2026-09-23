const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const parcelRoutes = require("./routes/parcelRoutes");
const trackingRoutes = require("./routes/trackingRoutes");
const deliveryAgentRoutes =
    require("./routes/deliveryAgentRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Courier API running"
    });
});

app.get("/api/test-db", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT 1 AS result");

        res.json({
            success: true,
            message: "MySQL connected successfully",
            data: rows
        });

    } catch (error) {
        console.error("DATABASE ERROR:", error);

        res.status(500).json({
            success: false,
            message: "MySQL connection failed",
            error: error.message
        });
    }
});

app.use("/api/auth", authRoutes);
app.use("/api/parcels", parcelRoutes);
app.use("/api/tracking", trackingRoutes);
app.use(
    "/api/delivery-agents",
    deliveryAgentRoutes
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Courier API running at http://localhost:${PORT}`);
});