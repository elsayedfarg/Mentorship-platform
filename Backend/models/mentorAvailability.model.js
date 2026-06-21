const mongoose = require("mongoose");

const mentorAvailabilitySchema = new mongoose.Schema(
  {
    mentor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MentorProfile",
      required: [true, "Mentor ID is required"],
    },
    day_of_week: {
      type: String,
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      required: [true, "Day of week is required"],
    },
    start_time: {
      type: String, // Format: "HH:MM" (24-hour)
      required: [true, "Start time is required"],
      match: /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/,
    },
    end_time: {
      type: String, // Format: "HH:MM" (24-hour)
      required: [true, "End time is required"],
      match: /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/,
    },
  },
  { collection: "mentorAvailability", timestamps: true },
);

mentorAvailabilitySchema.index({ mentor_id: 1, day_of_week: 1 });

module.exports = mongoose.model("MentorAvailability", mentorAvailabilitySchema);
