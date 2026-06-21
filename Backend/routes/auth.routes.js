const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authenticate = require("../middlewares/authenticate");
const validate = require("../middlewares/validate");
const { authLimiter } = require("../middlewares/rateLimiter");
const schemas = require("../schemas/authSchemas");

router.post(
  "/register",
  authLimiter,
  validate(schemas.registerSchema),
  authController.register,
);

router.post(
  "/login",
  authLimiter,
  validate(schemas.loginSchema),
  authController.login,
);

router.get("/profile", authenticate, authController.getProfile);

module.exports = router;
