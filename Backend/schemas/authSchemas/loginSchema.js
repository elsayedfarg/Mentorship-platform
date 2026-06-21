const Joi = require("joi");

const loginSchema = {
  body: Joi.object().keys({
    email: Joi.string().email().required().messages({
      "string.email": "Email must be valid",
      "any.required": "Email is required",
    }),
    password: Joi.string().required().messages({
      "any.required": "Password is required",
    }),
  }),
};

module.exports = loginSchema;
