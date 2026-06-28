const mongoose = require("mongoose");

const SESSION_STATUSES = [
  "Pending",
  "Accepted",
  "Rejected",
  "Completed",
  "Cancelled",
];

const VALID_TRANSITIONS = {
  Pending: ["Accepted", "Rejected", "Cancelled"],
  Accepted: ["Completed", "Cancelled"],
  Rejected: [],
  Completed: [],
  Cancelled: [],
};

const sessionSchema = new mongoose.Schema(
  {
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentProfile",
      required: [true, "Student ID is required"],
    },
    mentor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MentorProfile",
      required: [true, "Mentor ID is required"],
    },
    start_time: {
      type: Date,
      required: [true, "Start time is required"],
    },
    end_time: {
      type: Date,
      required: [true, "End time is required"],
    },
    description: {
      type: String,
      trim: true,
      required: [true, "Description is required"],
      minlength: 10,
      maxlength: 500,
    },
    status: {
      type: String,
      enum: SESSION_STATUSES,
      default: "Pending",
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "sessions", timestamps: false },
);


module.exports = mongoose.model("Session", sessionSchema);
module.exports.VALID_TRANSITIONS = VALID_TRANSITIONS;
module.exports.SESSION_STATUSES = SESSION_STATUSES;
