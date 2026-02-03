const express = require("express");
const router = express.Router();
const controller = require("../controllers/bids.controller.js");
const { requireAuth, requireRole } = require("../middleware/auth.middleware.js");

router.post("/auctions/:auctionId", requireAuth, requireRole("USER", "ADMIN", "ARTIST"), controller.placeBid);
router.get("/me", requireAuth, controller.myBids);

module.exports = router;
