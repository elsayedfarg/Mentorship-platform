const mongoose = require("mongoose");

const mentorProfileSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      unique: true,
    },
    stack_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stack",
    },
    name: {
      type: String,
      trim: true,
      default: "",
    },
    title: {
      type: String,
      trim: true,
      default: "",
    },
    bio: {
      type: String,
      maxlength: 1000,
      default: "",
    },
    is_verified: {
      type: Boolean,
      default: false,
    },
    average_rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    hourly_rate: {
      type: Number,
      default: 0,
      min: 0,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "mentorProfiles", timestamps: false },
);

mentorProfileSchema.index({ stack_id: 1 });
mentorProfileSchema.index({ is_verified: 1 });
mentorProfileSchema.index({ average_rating: -1 });

module.exports = mongoose.model("MentorProfile", mentorProfileSchema);
