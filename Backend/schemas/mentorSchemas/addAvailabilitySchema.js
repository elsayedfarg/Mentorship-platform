const Joi = require("joi");

const addAvailabilitySchema = {
  body: Joi.object().keys({
    day_of_week: Joi.string()
      .valid(
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      )
      .required()
      .messages({
        "any.required": "Day of week is required",
        "any.only": "Invalid day of week",
      }),
    start_time: Joi.string()
      .pattern(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/)
      .required()
      .messages({
        "string.pattern.base": "Time must be in HH:MM format (24-hour)",
        "any.required": "Start time is required",
      }),
    end_time: Joi.string()
      .pattern(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/)
      .required()
      .messages({
        "string.pattern.base": "Time must be in HH:MM format (24-hour)",
        "any.required": "End time is required",
      }),
  }),
};

module.exports = addAvailabilitySchema;
