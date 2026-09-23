const pool = require("../config/db");

exports.trackParcel = async (req, res) => {
    try {
        const { trackingNumber } = req.params;

        const [parcels] = await pool.query(
            "SELECT * FROM parcels WHERE tracking_number = ?",
            [trackingNumber]
        );

        if (parcels.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Tracking number not found"
            });
        }

        let history = [];

        try {
            const [rows] = await pool.query(
                `SELECT * FROM tracking_history
                 WHERE parcel_id = ?
                 ORDER BY 1 DESC`,
                [parcels[0].parcel_id]
            );

            history = rows;
        } catch (e) {
            console.log("Tracking history table/query needs adjustment.");
        }

        res.json({
            success: true,
            parcel: parcels[0],
            trackingHistory: history
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Tracking failed",
            error: error.message
        });
    }
};

exports.updateTracking = async (req, res) => {
    try {
        const {
            parcel_id,
            status,
            location,
            remarks
        } = req.body;

        await pool.query(
            `INSERT INTO tracking_history
             (parcel_id, status, location, remarks)
             VALUES (?, ?, ?, ?)`,
            [
                parcel_id,
                status,
                location || null,
                remarks || null
            ]
        );

        await pool.query(
            `UPDATE parcels
             SET status = ?
             WHERE parcel_id = ?`,
            [status, parcel_id]
        );

        res.json({
            success: true,
            message: "Tracking status updated"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Tracking update failed",
            error: error.message
        });
    }
};
