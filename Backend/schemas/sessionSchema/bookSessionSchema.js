const Joi = require("joi");

const bookSessionSchema = {
    body: Joi.object().keys({
        mentor_id: Joi.string().required().trim().messages({
            "any.required": "Mentor ID is required",
        }),
        start_time: Joi.date().iso().required().messages({
            "date.base": "Start time must be a valid date",
            "date.format": "Start time must be in ISO 8601 format",
            "any.required": "Start time is required",
        }),
        end_time: Joi.date().iso().required().messages({
            "date.base": "End time must be a valid date",
            "date.format": "End time must be in ISO 8601 format",
            "any.required": "End time is required",
        }),
        description: Joi.string().min(10).max(500).required().trim().messages({
            "string.min": "Description must be at least 10 characters",
            "string.max": "Description must not exceed 500 characters",
            "any.required": "Description is required",
        }),
    }),
};

module.exports = bookSessionSchema;
