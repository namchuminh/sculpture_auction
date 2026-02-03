const express = require("express");
const router = express.Router();
const controller = require("../controllers/auctions.controller.js");
const { requireAuth, requireRole } = require("../middleware/auth.middleware.js");

// public
router.get("/", controller.list);

// artist/admin
router.get("/me/list", requireAuth, requireRole("ARTIST", "ADMIN"), controller.myAuctions);

// public
router.get("/:id", controller.detail);

// artist/admin
router.post("/", requireAuth, requireRole("ARTIST", "ADMIN"), controller.create);
router.put("/:id", requireAuth, requireRole("ARTIST", "ADMIN"), controller.updateScheduled);

// close auction -> set winner + create order + notify
router.post("/:id/close", requireAuth, requireRole("ADMIN", "ARTIST"), controller.closeAuction);

// admin cancel
router.patch("/:id/cancel", requireAuth, requireRole("ADMIN"), controller.cancel);

module.exports = router;
