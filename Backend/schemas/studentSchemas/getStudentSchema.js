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
    "any.invalid": "Invalid user ID format",
  });

const getStudentSchema = {
  params: Joi.object().keys({
    id: objectIdSchema.required(),
  }),
};

module.exports = getStudentSchema;
