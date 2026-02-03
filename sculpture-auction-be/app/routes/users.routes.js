const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users.controller.js");
const { requireAuth, requireRole } = require("../middleware/auth.middleware.js");
const { upload } = require("../middleware/upload.middleware.js");

router.get("/me", requireAuth, usersController.me);
router.put("/me", requireAuth, upload.single("avatar"), usersController.updateMe);
router.put("/me/password", requireAuth, usersController.changePassword);

// admin
router.get("/", requireAuth, requireRole("ADMIN"), usersController.list);
router.get("/:id", requireAuth, requireRole("ADMIN"), usersController.detail);
router.patch("/:id/active", requireAuth, requireRole("ADMIN"), usersController.setActive);
router.patch("/:id/role", requireAuth, requireRole("ADMIN"), usersController.setRole);

module.exports = router;
