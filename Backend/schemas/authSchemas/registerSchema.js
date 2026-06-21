const Joi = require("joi");

const registerSchema = {
  body: Joi.object().keys({
    email: Joi.string().email().required().messages({
      "string.email": "Email must be valid",
      "any.required": "Email is required",
    }),
    password: Joi.string().min(8).required().messages({
      "string.min": "Password must be at least 8 characters",
      "any.required": "Password is required",
    }),
    role: Joi.string()
      .valid("admin", "mentor", "student")
      .default("student")
      .messages({
        "any.only": "Role must be 'admin', 'mentor', or 'student'",
      }),
  }),
};

module.exports = registerSchema;
