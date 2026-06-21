const Joi = require("joi");
const objectIdSchema = require("./objectIdSchema");

const createMentorSchema = {
  body: Joi.object().keys({
    name: Joi.string().min(2).max(100).required().messages({
      "string.min": "Name must be at least 2 characters",
      "any.required": "Name is required",
    }),
    stack_id: objectIdSchema.required(),
    title: Joi.string().min(3).max(100).required().messages({
      "string.min": "Title must be at least 3 characters",
      "any.required": "Title is required",
    }),
    bio: Joi.string().min(10).max(1000).required().messages({
      "string.min": "Bio must be at least 10 characters",
      "any.required": "Bio is required",
    }),
    hourly_rate: Joi.number().positive().required().messages({
      "number.positive": "Hourly rate must be greater than 0",
      "any.required": "Hourly rate is required",
    }),
  }),
};
module.exports = createMentorSchema;
