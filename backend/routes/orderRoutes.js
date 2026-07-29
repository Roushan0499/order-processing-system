const express = require("express");
const router = express.Router();

const controller = require("../controllers/orderController");
const upload = require("../middleware/upload");

// ==============================
// Orders
// ==============================

router.get("/", controller.getOrders);

router.get("/inventory", controller.getInventory);

router.post("/reset", controller.resetDatabase);

router.get("/:id", controller.getOrder);

// ==============================
// Upload Inventory
// ==============================

router.post(
    "/upload/inventory",
    upload.single("file"),
    controller.uploadInventory
);

// ==============================
// Upload Orders
// ==============================

router.post(
    "/upload/orders",
    upload.single("file"),
    controller.uploadOrders
);

// ==============================
// Retry
// ==============================

router.post(
    "/:id/retry",
    controller.retryOrder
);

// ==============================
// Mark Shipped
// ==============================

router.post(
    "/:id/shipped",
    controller.markShipped
);


module.exports = router;