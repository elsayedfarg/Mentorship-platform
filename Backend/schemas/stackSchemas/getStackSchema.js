const Joi = require("joi");

const getStackSchema = {
  params: Joi.object().keys({
    id: Joi.string()
      .custom((value, helpers) => {
        if (!require("mongoose").Types.ObjectId.isValid(value)) {
          return helpers.error("any.invalid");
        }
        return value;
      })
      .required()
      .messages({
        "any.invalid": "Invalid stack ID format",
      }),
  }),
};

module.exports = getStackSchema;
