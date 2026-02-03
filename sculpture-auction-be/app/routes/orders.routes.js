const express = require("express");
const router = express.Router();
const controller = require("../controllers/orders.controller.js");
const { requireAuth, requireRole } = require("../middleware/auth.middleware.js");

router.get("/me", requireAuth, controller.myOrders);
router.get("/artist", requireAuth, requireRole("ARTIST", "ADMIN"), controller.artistOrders);
router.get("/", requireAuth, requireRole("ADMIN"), controller.listAll);

router.get("/:id", requireAuth, controller.detail);
router.patch("/:id/shipping-address", requireAuth, controller.updateShippingAddress);
router.patch("/:id/status", requireAuth, requireRole("ADMIN"), controller.updateStatus);

module.exports = router;
