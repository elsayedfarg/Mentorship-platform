const Joi = require("joi");

const getUsersSchema = {
  query: Joi.object().keys({
    page: Joi.number().integer().min(1).default(1).messages({
      "number.base": "Page must be a number",
      "number.min": "Page must be at least 1",
    }),
    limit: Joi.number().integer().min(1).max(100).default(10).messages({
      "number.base": "Limit must be a number",
      "number.min": "Limit must be at least 1",
      "number.max": "Limit cannot exceed 100",
    }),
    role: Joi.string().valid("student", "mentor", "admin").optional().messages({
      "any.only": "Role must be one of: student, mentor, admin",
    }),
  }),
};

module.exports = getUsersSchema;
