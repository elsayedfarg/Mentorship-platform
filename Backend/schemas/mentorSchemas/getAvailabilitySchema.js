const Joi = require("joi");
const objectIdSchema = require("./objectIdSchema");

const getAvailabilitySchema = {
  params: Joi.object().keys({
    id: objectIdSchema.required(),
  }),
  query: Joi.object().keys({
    date: Joi.string()
      .pattern(/^\d{4}-\d{2}-\d{2}$/)
      .messages({
        "string.pattern.base": "Date must be in YYYY-MM-DD format",
      }),
  }),
};

module.exports = getAvailabilitySchema;
