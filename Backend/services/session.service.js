const Session = require("../models/session.model");
const { VALID_TRANSITIONS } = require("../models/session.model");
const MentorProfile = require("../models/mentorProfile.model");
const StudentProfile = require("../models/studentProfile.model");
const MentorAvailability = require("../models/mentorAvailability.model");
const APIError = require("../utils/APIError");
const logger = require("../utils/logger");
const throwIfNotFound = require("../utils/throwIfNotFound");
const {
  getWallClockTime,
  getWallClockDayOfWeek,
} = require("../utils/timeUtils");

const BUFFER_MINUTES = 10;

const STUDENT_ALLOWED_STATUSES = ["Completed", "Cancelled"];
const MENTOR_ALLOWED_STATUSES = ["Accepted", "Rejected", "Completed", "Cancelled"];

const bookSession = async (studentUserId, { mentor_id, start_time, end_time, description }) => {
  try {
    // 1. Validate profiles
    const studentProfile = await StudentProfile.findOne({ user_id: studentUserId });
    throwIfNotFound(studentProfile, "Student profile not found. Please complete your profile first.");

    const mentorProfile = await MentorProfile.findById(mentor_id);
    throwIfNotFound(mentorProfile, "Mentor not found");

    if (!mentorProfile.is_verified) {
      throw new APIError("This mentor is not yet verified and cannot accept sessions", 400);
    }

    // 2. Parse dates — Joi already validated format/order/future, but we still need Date objects
    const startDate = new Date(start_time);
    const endDate = new Date(end_time);

    // 3. Derive date from start_time (UTC midnight) — never trust a separate date field
    const sessionDate = new Date(
      Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate())
    );



    const dayOfWeek = getWallClockDayOfWeek(startDate);

    const requestedStart = getWallClockTime(startDate);
    const requestedEnd = getWallClockTime(endDate);

    const availability = await MentorAvailability.findOne({
      mentor_id,
      day_of_week: dayOfWeek,
      start_time: { $lte: requestedStart },
      end_time: { $gte: requestedEnd },
    });

    if (!availability) {
      throw new APIError(
        `Mentor is not available on ${dayOfWeek}s between ${requestedStart} and ${requestedEnd}`,
        400
      );
    }

    const bufferMs = BUFFER_MINUTES * 60 * 1000;
    const bufferedStart = new Date(startDate.getTime() - bufferMs);
    const bufferedEnd = new Date(endDate.getTime() + bufferMs);

    const conflict = await Session.findOne({
      mentor_id,
      status: { $in: ["Pending", "Accepted"] },
      start_time: { $lt: bufferedEnd },
      end_time: { $gt: bufferedStart },
    });

    if (conflict) {
      throw new APIError(
        `Time slot unavailable. Sessions require a ${BUFFER_MINUTES}-minute gap before and after.`,
        409
      );
    }

    // 6. Create session
    const session = await Session.create({
      student_id: studentProfile._id,
      mentor_id,
      start_time: startDate,
      end_time: endDate,
      date: sessionDate,
      description,
    });

    logger.info(`Session booked: ${session._id} by student ${studentUserId}`);

    return {
      _id: session._id,
      status: session.status,
      mentor_id: session.mentor_id,
      start_time: session.start_time,
      end_time: session.end_time,
      date: session.date,
      description: session.description,
      created_at: session.created_at,
    };
  } catch (err) {
    logger.error("Book session error:", err);
    throw err;
  }
};

const getUserSessions = async (userId, role) => {
  try {
    if (role === "mentor") {
      const mentorProfile = await MentorProfile.findOne({ user_id: userId });
      throwIfNotFound(mentorProfile, "Mentor profile not found");

      const sessions = await Session.find({ mentor_id: mentorProfile._id })
        .populate({
          path: "student_id",
          select: "name",
          populate: { path: "user_id", select: "email" },
        })
        .sort({ start_time: 1 });

      return sessions;
    }

    const studentProfile = await StudentProfile.findOne({ user_id: userId });
    throwIfNotFound(studentProfile, "Student profile not found");

    const sessions = await Session.find({ student_id: studentProfile._id })
      .populate("mentor_id", "name title hourly_rate average_rating")
      .sort({ start_time: 1 });

    return sessions;
  } catch (err) {
    logger.error("Get user sessions error:", err);
    throw err;
  }
};


const updateSessionStatus = async (sessionId, newStatus, requestingUser) => {
  try {
    const session = await Session.findById(sessionId);
    throwIfNotFound(session, "Session not found");

    if (requestingUser.role === "student") {
      const studentProfile = await StudentProfile.findOne({ user_id: requestingUser.userId });
      throwIfNotFound(studentProfile, "Student profile not found");

      if (!session.student_id.equals(studentProfile._id)) {
        throw new APIError("You are not authorized to update this session", 403);
      }

      if (!STUDENT_ALLOWED_STATUSES.includes(newStatus)) {
        throw new APIError(
          `Students can only set status to: ${STUDENT_ALLOWED_STATUSES.join(", ")}`,
          400,
        );
      }
    }

    if (requestingUser.role === "mentor") {
      const mentorProfile = await MentorProfile.findOne({ user_id: requestingUser.userId });
      throwIfNotFound(mentorProfile, "Mentor profile not found");

      if (!session.mentor_id.equals(mentorProfile._id)) {
        throw new APIError("You are not authorized to update this session", 403);
      }

      if (!MENTOR_ALLOWED_STATUSES.includes(newStatus)) {
        throw new APIError(
          `Mentors can only set status to: ${MENTOR_ALLOWED_STATUSES.join(", ")}`,
          400,
        );
      }
    }

    const allowedNextStatuses = VALID_TRANSITIONS[session.status];
    if (!allowedNextStatuses.includes(newStatus)) {
      throw new APIError(
        `Cannot transition from "${session.status}" to "${newStatus}". Allowed transitions: ${allowedNextStatuses.join(", ") || "none"}`,
        400,
      );
    }

    const updatedSession = await Session.findByIdAndUpdate(
      sessionId,
      { status: newStatus },
      { new: true, runValidators: true },
    )
      .populate("mentor_id", "name title")
      .populate("student_id", "name");

    logger.info(`Session ${sessionId} status updated to "${newStatus}" by ${requestingUser.userId}`);

    return updatedSession;
  } catch (err) {
    logger.error("Update session status error:", err);
    throw err;
  }
};



module.exports = {
  bookSession,
  getUserSessions,
  updateSessionStatus
};
