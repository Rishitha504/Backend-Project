const bcrypt = require("bcryptjs");
const pool = require("../config/db");

// Password validator
const validatePassword = require("../passwordValidator");


// ========================================
// DELIVERY AGENT REGISTRATION
// ========================================
exports.registerDeliveryAgent = async (req, res) => {
    const connection = await pool.getConnection();

    try {
        const {
            full_name,
            phone,
            email,
            password,
            vehicle_number,
            vehicle_type
        } = req.body;

        // Check required fields
        if (
            !full_name ||
            !phone ||
            !email ||
            !password ||
            !vehicle_number ||
            !vehicle_type
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required details"
            });
        }

        // ========================================
        // VALIDATE PASSWORD
        // ========================================
        const passwordValidation = validatePassword(password);

        if (!passwordValidation.valid) {
            return res.status(400).json({
                success: false,
                message: passwordValidation.message
            });
        }

        // ========================================
        // CHECK PHONE
        // ========================================
        const [existingPhone] = await connection.query(
            "SELECT user_id FROM users WHERE phone = ?",
            [phone]
        );

        if (existingPhone.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Phone number already registered"
            });
        }

        // ========================================
        // CHECK EMAIL
        // ========================================
        const [existingEmail] = await connection.query(
            "SELECT user_id FROM users WHERE email = ?",
            [email]
        );

        if (existingEmail.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Email already registered"
            });
        }

        await connection.beginTransaction();

        // ========================================
        // HASH PASSWORD
        // ========================================
        const hashedPassword = await bcrypt.hash(password, 10);

        // ========================================
        // CREATE USER ACCOUNT
        // ========================================
        const [userResult] = await connection.query(
            `INSERT INTO users
            (
                full_name,
                phone,
                email,
                password,
                role,
                account_status
            )
            VALUES (?, ?, ?, ?, 'Agent', 'Active')`,
            [
                full_name,
                phone,
                email,
                hashedPassword
            ]
        );

        const userId = userResult.insertId;

        // ========================================
        // GENERATE EMPLOYEE CODE
        // ========================================
        const employeeCode =
            "AG" + String(userId).padStart(4, "0");

        // ========================================
        // CREATE DELIVERY AGENT RECORD
        // ========================================
        await connection.query(
            `INSERT INTO delivery_agents
            (
                user_id,
                employee_code,
                vehicle_number,
                vehicle_type,
                availability_status
            )
            VALUES (?, ?, ?, ?, 'Available')`,
            [
                userId,
                employeeCode,
                vehicle_number,
                vehicle_type
            ]
        );

        await connection.commit();

        res.status(201).json({
            success: true,
            message: "Delivery agent registered successfully",
            user_id: userId,
            employee_code: employeeCode
        });

    } catch (error) {

        await connection.rollback();

        console.error(
            "DELIVERY AGENT REGISTRATION ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Delivery agent registration failed",
            error: error.message
        });

    } finally {
        connection.release();
    }
};


// ============================================
// DELIVERY AGENT LOGIN
// ============================================

exports.loginDeliveryAgent = async (req, res) => {
    const connection = await pool.getConnection();

    try {
        const { email, password } = req.body;

        // Check required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please enter email and password"
            });
        }

        // ========================================
        // FIND DELIVERY AGENT
        // ========================================
        const [users] = await connection.query(
            `SELECT
                user_id,
                full_name,
                phone,
                email,
                password,
                role,
                account_status
             FROM users
             WHERE email = ? AND role = 'Agent'`,
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Delivery agent account not found"
            });
        }

        const user = users[0];

        // ========================================
        // CHECK PASSWORD USING BCRYPT
        // ========================================
        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid password"
            });
        }

        // ========================================
        // CHECK ACCOUNT STATUS
        // ========================================
        if (user.account_status !== "Active") {
            return res.status(403).json({
                success: false,
                message: "Your delivery agent account is not active"
            });
        }

        // ========================================
        // GET DELIVERY AGENT DETAILS
        // ========================================
        const [agents] = await connection.query(
            `SELECT
                agent_id,
                user_id,
                employee_code,
                vehicle_number,
                vehicle_type,
                availability_status
             FROM delivery_agents
             WHERE user_id = ?`,
            [user.user_id]
        );

        if (agents.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Delivery agent details not found"
            });
        }

        const agent = agents[0];

        // ========================================
        // SEND RESPONSE
        // ========================================
        res.status(200).json({
            success: true,
            message: "Delivery agent login successful",
            user: {
                user_id: user.user_id,
                full_name: user.full_name,
                phone: user.phone,
                email: user.email,
                role: user.role,
                employee_code: agent.employee_code,
                vehicle_number: agent.vehicle_number,
                vehicle_type: agent.vehicle_type,
                availability_status: agent.availability_status
            }
        });

    } catch (error) {

        console.error(
            "DELIVERY AGENT LOGIN ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Delivery agent login failed",
            error: error.message
        });

    } finally {
        connection.release();
    }
};