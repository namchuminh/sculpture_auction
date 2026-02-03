const express = require("express");
const router = express.Router();
const controller = require("../controllers/watchlist.controller.js");
const { requireAuth } = require("../middleware/auth.middleware.js");

router.get("/", requireAuth, controller.list);
router.post("/", requireAuth, controller.add);
router.delete("/:auctionId", requireAuth, controller.remove);

module.exports = router;
