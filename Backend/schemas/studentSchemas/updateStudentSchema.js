const Joi = require("joi");

const updateStudentSchema = {
  body: Joi.object().keys({
    name: Joi.string().min(2).max(100).messages({
      "string.min": "Name must be at least 2 characters",
      "string.max": "Name must not exceed 100 characters",
    }),
  }),
};

module.exports = updateStudentSchema;
