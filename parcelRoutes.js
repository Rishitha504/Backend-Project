const express = require("express");

const router = express.Router();

const {
    bookParcel,
    getParcels,
    getParcelById,
    deleteParcel
} = require("../controllers/parcel_controller");


// Book parcel
router.post("/", bookParcel);

// Get all parcels
router.get("/", getParcels);

// Get parcel by ID
router.get("/:id", getParcelById);

// Delete parcel
router.delete("/:id", deleteParcel);

module.exports = router;