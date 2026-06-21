const mongoose = require("mongoose");

const studentProfileSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      unique: true,
    },
    name: {
      type: String,
      trim: true,
      default: "",
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "studentProfiles", timestamps: false },
);

module.exports = mongoose.model("StudentProfile", studentProfileSchema);
