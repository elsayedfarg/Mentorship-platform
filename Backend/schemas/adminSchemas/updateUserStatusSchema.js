const Joi = require("joi");

const updateUserStatusSchema = {
  body: Joi.object().keys({
    is_verified: Joi.boolean().required().messages({
      "any.required": "is_verified is required",
      "boolean.base": "is_verified must be a boolean",
    }),
  }),
};

module.exports = updateUserStatusSchema;
