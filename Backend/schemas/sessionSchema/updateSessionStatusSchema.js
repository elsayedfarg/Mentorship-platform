const Joi = require("joi");
const mongoose = require("mongoose");

const updateSessionStatusSchema = {
  body: Joi.object().keys({
    status: Joi.string()
      .valid("Accepted", "Rejected", "Completed", "Cancelled")
      .required()
      .messages({
        "any.required": "Status is required",
        "any.only":
          "Status must be one of: Accepted, Rejected, Completed, Cancelled",
      }),
  }),
};

module.exports = updateSessionStatusSchema;
