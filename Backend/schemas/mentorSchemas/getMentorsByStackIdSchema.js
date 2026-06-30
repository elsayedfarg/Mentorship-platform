const Joi = require("joi");
const objectIdSchema = require("./objectIdSchema");

const getMentorsByStackIdSchema = {
    params: Joi.object().keys({
        stackId: objectIdSchema.required(),
    }),
};

module.exports = getMentorsByStackIdSchema;
