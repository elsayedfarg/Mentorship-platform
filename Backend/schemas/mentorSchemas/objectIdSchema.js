const Joi = require("joi");
const mongoose = require("mongoose");

const objectIdSchema = Joi.string()
  .custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      return helpers.error("any.invalid");
    }
    return value;
  })
  .messages({
    "any.invalid": "Invalid ID format",
  });

module.exports = objectIdSchema;
