const express = require("express");
const router = express.Router();
const mentorController = require("../controllers/mentor.controller");
const authenticate = require("../middlewares/authenticate");
const restrictTo = require("../middlewares/restrictTo");
const validate = require("../middlewares/validate");

const schemas = require("../schemas/mentorSchemas");

router.get("/", mentorController.getAllMentors);

router.post(
  "/profile",
  authenticate,
  restrictTo(["mentor"]),
  validate(schemas.createMentorSchema),
  mentorController.createProfile,
);

router.get(
  "/profile",
  authenticate,
  restrictTo(["mentor"]),
  mentorController.getProfile,
);

router.put(
  "/profile",
  authenticate,
  restrictTo(["mentor"]),
  validate(schemas.updateMentorSchema),
  mentorController.updateProfile,
);

router.get(
  "/me/availability",
  authenticate,
  restrictTo(["mentor"]),
  mentorController.getAllAvailability,
);

router.post(
  "/availability",
  authenticate,
  restrictTo(["mentor"]),
  validate(schemas.addAvailabilitySchema),
  mentorController.addAvailability,
);

router.delete(
  "/availability/:blockId",
  authenticate,
  restrictTo(["mentor"]),
  mentorController.removeAvailability,
);

router.get(
  "/:id/availability",
  validate(schemas.getAvailabilitySchema),
  mentorController.getAvailability,
);

router.get(
  "/:id",
  validate(schemas.getMentorSchema),
  mentorController.getMentorById,
);

module.exports = router;
