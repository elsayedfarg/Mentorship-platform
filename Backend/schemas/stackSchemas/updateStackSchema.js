const Joi = require("joi");

const updateStackSchema = {
  body: Joi.object().keys({
    name: Joi.string().min(2).max(50).optional().trim().messages({
      "string.min": "Stack name must be at least 2 characters",
      "string.max": "Stack name must not exceed 50 characters",
    }),
    description: Joi.string().min(10).max(500).optional().trim().messages({
      "string.min": "Description must be at least 10 characters",
      "string.max": "Description must not exceed 500 characters",
    }),
    icon: Joi.string().optional().allow(null).trim(),
    color: Joi.string()
      .optional()
      .regex(/^#[0-9A-F]{6}$/i)
      .messages({
        "string.pattern.base": "Color must be a valid hex code",
      }),
  }),
};

module.exports = updateStackSchema;
