const User = require("../models/user.model");
const MentorProfile = require("../models/mentorProfile.model");
const StudentProfile = require("../models/studentProfile.model");
const APIError = require("../utils/APIError");
const logger = require("../utils/logger");
const throwIfNotFound = require("../utils/throwIfNotFound");

const getAllUsers = async ({ page = 1, limit = 10, role } = {}) => {
  try {
    const query = {};
    if (role) {
      query.role = role;
    }
    const skip = (page - 1) * limit;
    const users = await User.find(query)
      .select("-password_hash")
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit);
    const total = await User.countDocuments(query);

    const enrichedUsers = await Promise.all(
      users.map(async (user) => {
        const userObj = user.toObject();
        if (user.role === "mentor") {
          const mentorProfile = await MentorProfile.findOne({ user_id: user._id })
            .populate("stack_id", "name color icon")
            .lean();
          userObj.profile = mentorProfile || null;
        } else if (user.role === "student") {
          const studentProfile = await StudentProfile.findOne({ user_id: user._id }).lean();
          userObj.profile = studentProfile || null;
        }
        return userObj;
      })
    );

    return {
      data: enrichedUsers,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (err) {
    logger.error("Admin get all users error:", err);
    throw err;
  }
};

const updateUserStatus = async (userId, is_verified) => {
  try {
    const user = await User.findById(userId).select("-password_hash");
    throwIfNotFound(user, "User not found");

    if (user.role !== "mentor") {
      throw new APIError(
        `User verification is only applicable to mentors. This user has role "${user.role}".`,
        400,
      );
    }

    const mentorProfile = await MentorProfile.findOneAndUpdate(
      { user_id: userId },
      { is_verified },
      { new: true, runValidators: true },
    )
      .populate("user_id", "email role created_at")
      .populate("stack_id", "name description");

    throwIfNotFound(mentorProfile, "Mentor profile not found for this user");

    logger.info(
      `Admin updated user ${userId} is_verified → ${is_verified}`,
    );

    return mentorProfile;
  } catch (err) {
    logger.error("Admin update user status error:", err);
    throw err;
  }
};


const getPendingMentors = async ({ page = 1, limit = 10 } = {}) => {
  try {
    const skip = (page - 1) * limit;

    const mentors = await MentorProfile.find({ is_verified: false })
      .populate("user_id", "email role created_at")
      .populate("stack_id", "name description")
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit);

    const total = await MentorProfile.countDocuments({ is_verified: false });

    return {
      data: mentors,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (err) {
    logger.error("Admin get pending mentors error:", err);
    throw err;
  }
};

module.exports = {
  getAllUsers,
  updateUserStatus,
  getPendingMentors,
};