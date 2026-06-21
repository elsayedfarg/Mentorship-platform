const express = require("express");
const router = express.Router();
const studentController = require("../controllers/student.controller");
const authenticate = require("../middlewares/authenticate");
const restrictTo = require("../middlewares/restrictTo");
const validate = require("../middlewares/validate");
const schemas = require("../schemas/studentSchemas");

router.get("/profile", authenticate, studentController.getProfile);

router.put(
  "/profile",
  authenticate,
  restrictTo(["student"]),
  validate(schemas.updateStudentSchema),
  studentController.updateProfile,
);

router.get(
  "/",
  authenticate,
  restrictTo(["admin"]),
  studentController.getAllStudents,
);

module.exports = router;
