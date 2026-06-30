const Joi = require("joi");
const {
  SESSION_DURATION_MINUTES,
  getSessionDurationMinutes,
  isSameWallClockDay,
} = require("../../utils/timeUtils");

const bookSessionSchema = {
  body: Joi.object()
    .keys({
      mentor_id: Joi.string().required().trim().messages({
        "any.required": "Mentor ID is required",
      }),
      start_time: Joi.date().iso().greater("now").required().messages({
        "date.base": "Start time must be a valid date",
        "date.format": "Start time must be in ISO 8601 format",
        "date.greater": "Start time must be in the future",
        "any.required": "Start time is required",
      }),
      end_time: Joi.date().iso().greater(Joi.ref("start_time")).required().messages({
        "date.base": "End time must be a valid date",
        "date.format": "End time must be in ISO 8601 format",
        "date.greater": "End time must be after start time",
        "any.required": "End time is required",
      }),
      description: Joi.string().min(10).max(500).required().trim().messages({
        "string.min": "Description must be at least 10 characters",
        "string.max": "Description must not exceed 500 characters",
        "any.required": "Description is required",
      }),
    })
    .custom((value, helpers) => {
      if (!isSameWallClockDay(value.start_time, value.end_time)) {
        return helpers.message("Start and end time must be on the same day");
      }

      const durationMinutes = getSessionDurationMinutes(value.start_time, value.end_time);
      if (durationMinutes !== SESSION_DURATION_MINUTES) {
        return helpers.message(
          `Session must be exactly ${SESSION_DURATION_MINUTES} minutes long`,
        );
      }

      return value;
    }),
};

module.exports = bookSessionSchema;
