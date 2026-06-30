const Joi = require("joi");
const { SESSION_DURATION_MINUTES } = require("../../utils/timeUtils");

const addAvailabilitySchema = {
  body: Joi.object()
    .keys({
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
    })
    .custom((value, helpers) => {
      if (value.start_time >= value.end_time) {
        return helpers.message("End time must be after start time");
      }

      const [startHour, startMinute] = value.start_time.split(":").map(Number);
      const [endHour, endMinute] = value.end_time.split(":").map(Number);
      const durationMinutes =
        endHour * 60 + endMinute - (startHour * 60 + startMinute);

      if (durationMinutes < SESSION_DURATION_MINUTES) {
        return helpers.message(
          `Availability block must be at least ${SESSION_DURATION_MINUTES} minutes long`,
        );
      }

      return value;
    }),
};

module.exports = addAvailabilitySchema;
