
require("dotenv").config();

const bcrypt = require("bcryptjs");
const readline = require("readline");
const pool = require("./config/db");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Enter your NEW Admin password: ", async (password) => {
    try {
        if (
            password.length < 8 ||
            !/[A-Z]/.test(password) ||
            !/[a-z]/.test(password) ||
            !/[0-9]/.test(password) ||
            !/[^A-Za-z0-9]/.test(password)
        ) {
            console.log(
                "Password must contain 8+ characters, uppercase, lowercase, a number, and a symbol."
            );
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await pool.query(
            `UPDATE users
             SET password = ?
             WHERE email = ? AND role = 'Admin'`,
            [hashedPassword, "admin@courier.com"]
        );

        if (result.affectedRows === 1) {
            console.log("Admin password updated successfully.");
        } else {
            console.log("Admin account not found. No password was changed.");
        }
    } catch (error) {
        console.error("Password reset failed:", error.message);
    } finally {
        await pool.end();
        rl.close();
    }
});