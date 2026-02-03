const express = require("express");
const router = express.Router();
const sculpturesController = require("../controllers/sculptures.controller.js");
const { requireAuth, requireRole } = require("../middleware/auth.middleware.js");
const { upload } = require("../middleware/upload.middleware.js");

// public
router.get("/:id", sculpturesController.detail);
router.get("/:id/images", sculpturesController.listImages);
router.get("/:id/reviews", sculpturesController.listReviews);
router.get("/", sculpturesController.list);


// artist/admin
router.put("/:id", requireAuth, requireRole("ARTIST", "ADMIN"), upload.single("image"), sculpturesController.update);
router.patch("/:id/status", requireAuth, requireRole("ARTIST", "ADMIN"), sculpturesController.setStatus);
router.post("/", requireAuth, requireRole("ARTIST", "ADMIN"), upload.single("image"), sculpturesController.create);

module.exports = router;
