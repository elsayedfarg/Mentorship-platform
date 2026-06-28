const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin.controller");
const authenticate = require("../middlewares/authenticate");
const restrictTo = require("../middlewares/restrictTo");
const validate = require("../middlewares/validate");
const schemas = require("../schemas/adminSchemas");


router.get(
  "/users",
  authenticate,
  restrictTo(["admin"]),
  validate(schemas.getUsersSchema),
  adminController.getAllUsers,
);


router.put(
  "/users/:userId/status",
  authenticate,
  restrictTo(["admin"]),
  validate({
    ...schemas.userIdParamSchema,
    ...schemas.updateUserStatusSchema,
  }),
  adminController.updateUserStatus,
);


router.get(
  "/mentors/pending",
  authenticate,
  restrictTo(["admin"]),
  validate(schemas.getUsersSchema),
  adminController.getPendingMentors,
);

module.exports = router;
