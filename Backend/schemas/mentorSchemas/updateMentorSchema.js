const Joi = require("joi");
const objectIdSchema = require("./objectIdSchema");

const updateMentorSchema = {
  body: Joi.object().keys({
    name: Joi.string().min(2).max(100),
    title: Joi.string().min(3).max(100),
    bio: Joi.string().min(10).max(1000),
    hourly_rate: Joi.number().positive(),
    stack_id: objectIdSchema,
  }),
};

module.exports = updateMentorSchema;
