const mongoose = require("mongoose");

const stackSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Stack name is required"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Stack description is required"],
    },
  },
  { collection: "stacks", timestamps: true },
);

module.exports = mongoose.model("Stack", stackSchema);
