const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller.js");
const { requireAuth } = require("../middleware/auth.middleware.js");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", requireAuth, authController.me);

module.exports = router;
