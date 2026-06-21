const Joi = require("joi");

const createStudentSchema = {
  body: Joi.object().keys({
    name: Joi.string().min(2).max(100).required().messages({
      "string.min": "Name must be at least 2 characters",
      "string.max": "Name must not exceed 100 characters",
      "any.required": "Name is required",
    }),
  }),
};

module.exports = createStudentSchema;
