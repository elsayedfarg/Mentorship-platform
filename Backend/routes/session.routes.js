const express = require("express");
const router = express.Router();

const sessionController = require("../controllers/session.controller");
const authenticate = require("../middlewares/authenticate");
const restrictTo = require("../middlewares/restrictTo");
const validate = require("../middlewares/validate");
const schemas = require("../schemas/sessionSchema");


router.post(
  "/book",
  authenticate,
  restrictTo(["student"]),
  validate(schemas.bookSessionSchema),
  sessionController.bookSession,
);


router.get(
  "/",
  authenticate,
  restrictTo(["student"]),
  sessionController.getUserSessions,
);

router.put(
  "/:sessionId/status",
  authenticate,
  restrictTo(["mentor", "admin"]),
  validate({
    ...schemas.sessionIdParamSchema,
    ...schemas.updateSessionStatusSchema,
  }),
  sessionController.updateSessionStatus,
);

module.exports = router;
