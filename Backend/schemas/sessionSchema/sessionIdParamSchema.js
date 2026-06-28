const Joi = require("joi");
const mongoose = require("mongoose");

const sessionIdParamSchema = {
  params: Joi.object().keys({
    sessionId: Joi.string()
      .custom((value, helpers) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
          return helpers.error("any.invalid");
        }
        return value;
      })
      .required()
      .messages({
        "any.required": "Session ID is required",
        "any.invalid": "Invalid session ID format",
      }),
  }),
};

module.exports = sessionIdParamSchema;
