const express = require("express");
const router = express.Router();
const controller = require("../controllers/payments.controller.js");
const { requireAuth, requireRole } = require("../middleware/auth.middleware.js");

router.post("/orders/:orderId", requireAuth, controller.createForOrder);
router.get("/orders/:orderId", requireAuth, controller.listForOrder);

// admin/system cập nhật kết quả thanh toán
router.patch("/:id/complete", requireAuth, requireRole("ADMIN"), controller.complete);

router.get("/", requireAuth, requireRole("ADMIN"), controller.listAll);

module.exports = router;
