const express = require("express");
const router = express.Router();

const trackingController =
    require("../controllers/tracking_controller");

router.get("/:trackingNumber", trackingController.trackParcel);

router.post(
    "/update",
    trackingController.updateTracking
);

module.exports = router;