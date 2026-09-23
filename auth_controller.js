const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

// Password validator
const validatePassword = require("../passwordValidator");

// ===============================
// REGISTER USER
// ===============================
exports.register = async (req, res) => {
    try {
        const {
            full_name,
            phone,
            email,
            password
        } = req.body;

        // Check required fields
        if (!full_name || !phone || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields"
            });
        }

        // ===============================
        // VALIDATE PASSWORD
        // ===============================
        const passwordValidation = validatePassword(password);

        if (!passwordValidation.valid) {
            return res.status(400).json({
                success: false,
                message: passwordValidation.message
            });
        }

        // ===============================
        // CHECK EMAIL
        // ===============================
        const [existingUser] = await pool.query(
            "SELECT user_id FROM users WHERE email = ?",
            [email]
        );

        if (existingUser.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Email already registered"
            });
        }

        // ===============================
        // HASH PASSWORD
        // ===============================
        const hashedPassword = await bcrypt.hash(password, 10);

        // ===============================
        // INSERT USER
        // ===============================
        const [result] = await pool.query(
            `INSERT INTO users
            (full_name, phone, email, password, role, account_status)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                full_name,
                phone,
                email,
                hashedPassword,
                "Sender",
                "Active"
            ]
        );

        res.status(201).json({
            success: true,
            message: "Registration successful",
            user_id: result.insertId
        });

    } catch (error) {
        console.error("REGISTER ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Registration failed",
            error: error.message
        });
    }
};


// ===============================
// LOGIN USER
// ===============================
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // ===============================
        // FIND USER
        // ===============================
        const [users] = await pool.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const user = users[0];

        // ===============================
        // CHECK PASSWORD
        // ===============================
        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // ===============================
        // CREATE JWT TOKEN
        // ===============================
        const token = jwt.sign(
            {
                user_id: user.user_id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "24h"
            }
        );

        // ===============================
        // SEND RESPONSE
        // ===============================
        res.json({
            success: true,
            message: "Login successful",
            token: token,
            user: {
                user_id: user.user_id,
                full_name: user.full_name,
                phone: user.phone,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("LOGIN ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Login failed",
            error: error.message
        });
    }
};