const Joi = require("joi");
const objectIdSchema = require("./objectIdSchema");

const getMentorSchema = {
  params: Joi.object().keys({
    id: objectIdSchema.required(),
  }),
};

module.exports = getMentorSchema;
