const express = require("express");
const router = express.Router();
const controller = require("../controllers/notifications.controller.js");
const { requireAuth } = require("../middleware/auth.middleware.js");

router.get("/me", requireAuth, controller.listMe);
router.patch("/:id/read", requireAuth, controller.markRead);
router.patch("/me/read-all", requireAuth, controller.readAll);

module.exports = router;
