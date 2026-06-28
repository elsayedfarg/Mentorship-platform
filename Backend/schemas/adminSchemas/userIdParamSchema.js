const Joi = require("joi");
const mongoose = require("mongoose");

const userIdParamSchema = {
  params: Joi.object().keys({
    userId: Joi.string()
      .custom((value, helpers) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
          return helpers.error("any.invalid");
        }
        return value;
      })
      .required()
      .messages({
        "any.required": "User ID is required",
        "any.invalid": "Invalid user ID format",
      }),
  }),
};

module.exports = userIdParamSchema;
