const pool = require("../config/db");

// ========================================
// BOOK PARCEL
// ========================================
exports.bookParcel = async (req, res) => {
    try {
        const {
            sender_id,
            receiver_name,
            receiver_phone,
            receiver_address,
            parcel_type,
            weight,
            delivery_type,
            amount
        } = req.body;

        // Check required details
        if (
            !sender_id ||
            !receiver_name ||
            !receiver_phone ||
            !receiver_address
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required details"
            });
        }

        // ----------------------------------------
        // Get sender's default address
        // ----------------------------------------
        const [addressRows] = await pool.query(
            `SELECT address_id
             FROM addresses
             WHERE user_id = ?
             ORDER BY is_default DESC, address_id ASC
             LIMIT 1`,
            [sender_id]
        );

        if (addressRows.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please add a sender address first"
            });
        }

        const pickup_address_id = addressRows[0].address_id;

        // ----------------------------------------
        // Generate tracking number
        // ----------------------------------------
        const trackingNumber =
            "CP" +
            Date.now().toString().slice(-10);

        // ----------------------------------------
        // Insert parcel
        // ----------------------------------------
        const [result] = await pool.query(
            `INSERT INTO parcels
            (
                tracking_number,
                sender_id,
                receiver_name,
                receiver_phone,
                pickup_address_id,
                delivery_address,
                delivery_city,
                delivery_state,
                delivery_pincode,
                parcel_type,
                weight,
                delivery_type,
                delivery_charge,
                status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                trackingNumber,
                sender_id,
                receiver_name,
                receiver_phone,
                pickup_address_id,
                receiver_address,
                "Not Provided",
                "Telangana",
                "000000",
                parcel_type || null,
                weight || null,
                delivery_type || null,
                amount || 0,
                "Booked"
            ]
        );

        // ----------------------------------------
        // Success response
        // ----------------------------------------
        res.status(201).json({
            success: true,
            message: "Parcel booked successfully",
            trackingNumber: trackingNumber,
            parcelId: result.insertId
        });

    } catch (error) {

        console.error("BOOK PARCEL ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Parcel booking failed",
            error: error.message
        });
    }
};


// ========================================
// GET ALL PARCELS
// ========================================
exports.getParcels = async (req, res) => {
    try {

        const [rows] = await pool.query(
            "SELECT * FROM parcels ORDER BY parcel_id DESC"
        );

        res.status(200).json({
            success: true,
            count: rows.length,
            data: rows
        });

    } catch (error) {

        console.error("GET PARCELS ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Unable to get parcels",
            error: error.message
        });
    }
};


// ========================================
// GET PARCEL BY ID
// ========================================
exports.getParcelById = async (req, res) => {
    try {

        const { id } = req.params;

        const [rows] = await pool.query(
            "SELECT * FROM parcels WHERE parcel_id = ?",
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Parcel not found"
            });
        }

        res.status(200).json({
            success: true,
            data: rows[0]
        });

    } catch (error) {

        console.error("GET PARCEL BY ID ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Unable to get parcel",
            error: error.message
        });
    }
};


// ========================================
// DELETE PARCEL
// ========================================
exports.deleteParcel = async (req, res) => {
    try {

        const { id } = req.params;

        const [result] = await pool.query(
            "DELETE FROM parcels WHERE parcel_id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Parcel not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Parcel deleted successfully"
        });

    } catch (error) {

        console.error("DELETE PARCEL ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Unable to delete parcel",
            error: error.message
        });
    }
};