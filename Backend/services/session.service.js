const Session = require("../models/session.model");
const { VALID_TRANSITIONS } = require("../models/session.model");
const MentorProfile = require("../models/mentorProfile.model");
const StudentProfile = require("../models/studentProfile.model");
const APIError = require("../utils/APIError");
const logger = require("../utils/logger");
const throwIfNotFound = require("../utils/throwIfNotFound");

const bookSession = async (studentUserId, { mentor_id, start_time, end_time, description }) => {
  try {

    const studentProfile = await StudentProfile.findOne({ user_id: studentUserId });
    throwIfNotFound(studentProfile, "Student profile not found. Please complete your profile first.");


    const mentorProfile = await MentorProfile.findById(mentor_id);
    throwIfNotFound(mentorProfile, "Mentor not found");

    if (!mentorProfile.is_verified) {
      throw new APIError("This mentor is not yet verified and cannot accept sessions", 400);
    }

    const startDate = new Date(start_time);
    const endDate = new Date(end_time);

    if (startDate >= endDate) {
      throw new APIError("end_time must be after start_time", 400);
    }

    if (startDate < new Date()) {
      throw new APIError("Session cannot be booked in the past", 400);
    }

    
    const conflict = await Session.findOne({
      mentor_id,
      status: { $in: ["Pending", "Accepted"] },
      $or: [
        { start_time: { $lt: endDate }, end_time: { $gt: startDate } },
      ],
    });

    if (conflict) {
      throw new APIError(
        "The selected time slot is not available. The mentor already has a session during this period.",
        409,
      );
    }

    const session = await Session.create({
      student_id: studentProfile._id,
      mentor_id,
      start_time: startDate,
      end_time: endDate,
      description,
    });


    logger.info(`Session booked: ${session._id} by student ${studentUserId}`);

    return {
      _id: session._id,
      status: session.status,
      mentor_id: session.mentor_id,
      start_time: session.start_time,
      end_time: session.end_time,
      description: session.description,
      created_at: session.created_at,
      sessionAuditLog: {
        _id: auditLog._id,
        predicted_tag: auditLog.predicted_tag,
        confidence_score: auditLog.confidence_score,
      },
    };
  } catch (err) {
    logger.error("Book session error:", err);
    throw err;
  }
};

/**
 * Get all sessions belonging to a student user.
 */
const getUserSessions = async (studentUserId) => {
  try {
    const studentProfile = await StudentProfile.findOne({ user_id: studentUserId });
    throwIfNotFound(studentProfile, "Student profile not found");

    const sessions = await Session.find({ student_id: studentProfile._id })
      .populate("mentor_id", "name title hourly_rate average_rating")
      .sort({ created_at: -1 });

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

    if (requestingUser.role === "mentor") {
      const mentorProfile = await MentorProfile.findOne({ user_id: requestingUser.userId });
      throwIfNotFound(mentorProfile, "Mentor profile not found");

      if (!session.mentor_id.equals(mentorProfile._id)) {
        throw new APIError("You are not authorized to update this session", 403);
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
