const express = require("express");
const router = express.Router();
const stackController = require("../controllers/stack.controller");
const authenticate = require("../middlewares/authenticate");
const restrictTo = require("../middlewares/restrictTo");
const validate = require("../middlewares/validate");
const schemas = require("../schemas/stackSchemas");

router.get("/", stackController.getAllStacks);

router.get("/stats", stackController.getStacksWithStats);

router.get(
  "/:id",
  validate(schemas.getStackSchema),
  stackController.getStackById,
);

router.post(
  "/",
  authenticate,
  restrictTo(["admin"]),
  validate(schemas.createStackSchema),
  stackController.createStack,
);

router.put(
  "/:id",
  authenticate,
  restrictTo(["admin"]),
  validate(schemas.updateStackSchema),
  stackController.updateStack,
);

router.delete(
  "/:id",
  authenticate,
  restrictTo(["admin"]),
  validate(schemas.getStackSchema),
  stackController.deleteStack,
);

module.exports = router;
