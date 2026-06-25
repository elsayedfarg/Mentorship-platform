const mongoose = require("mongoose");

const stackSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Stack name is required"],
      unique: true,
      trim: true,
      minlength: [2, "Stack name must be at least 2 characters"],
      maxlength: [50, "Stack name must not exceed 50 characters"],
    },
    description: {
      type: String,
      required: [true, "Stack description is required"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters"],
      maxlength: [500, "Description must not exceed 500 characters"],
    },
    icon: {
      type: String,
      default: null,
    },
    color: {
      type: String,
      default: "#0F766E",
      match: [/^#[0-9A-F]{6}$/i, "Please provide a valid hex color"],
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "stacks", timestamps: true },
);

module.exports = mongoose.model("Stack", stackSchema);
