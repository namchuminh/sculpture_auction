const express = require("express");
const router = express.Router();
const controller = require("../controllers/sculptureImages.controller.js");
const { requireAuth, requireRole } = require("../middleware/auth.middleware.js");
const { upload } = require("../middleware/upload.middleware.js");

// add many images to a sculpture: POST /sculpture-images/sculptures/:sculptureId
router.post(
    "/sculptures/:sculptureId",
    requireAuth,
    requireRole("ARTIST", "ADMIN"),
    upload.array("images", 10),
    controller.addMany
);

// update image meta: primary/sort
router.patch("/:id", requireAuth, requireRole("ARTIST", "ADMIN"), controller.updateMeta);

// delete
router.delete("/:id", requireAuth, requireRole("ARTIST", "ADMIN"), controller.remove);

module.exports = router;
