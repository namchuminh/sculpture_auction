const express = require("express");
const router = express.Router();
const categoriesController = require("../controllers/categories.controller.js");
const { requireAuth, requireRole } = require("../middleware/auth.middleware.js");
const { upload } = require("../middleware/upload.middleware.js");

// public
router.get("/", categoriesController.list);
router.get("/:id", categoriesController.detail);

// admin
router.post("/", requireAuth, requireRole("ADMIN"), upload.single("image"), categoriesController.create);
router.put("/:id", requireAuth, requireRole("ADMIN"), upload.single("image"), categoriesController.update);
router.delete("/:id", requireAuth, requireRole("ADMIN"), categoriesController.remove);

module.exports = router;
