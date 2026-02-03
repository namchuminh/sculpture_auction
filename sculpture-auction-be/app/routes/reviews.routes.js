const express = require("express");
const router = express.Router();
const controller = require("../controllers/reviews.controller.js");
const { requireAuth, requireRole } = require("../middleware/auth.middleware.js");

router.post("/orders/:orderId", requireAuth, requireRole("USER", "ADMIN", "ARTIST"), controller.createForOrder);

// admin xem/lọc
router.get("/", requireAuth, requireRole("ADMIN"), controller.listAll);

module.exports = router;
