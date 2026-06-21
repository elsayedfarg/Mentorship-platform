const StudentProfile = require("../models/studentProfile.model");
const User = require("../models/user.model");
const APIError = require("../utils/APIError");
const logger = require("../utils/logger");
const throwIfNotFound = require("../utils/throwIfNotFound");

const getStudentProfile = async (userId) => {
  try {
    const student = await StudentProfile.findOne({ user_id: userId }).populate(
      "user_id",
      "email role created_at",
    );

    return throwIfNotFound(
      student,
      `Student profile not found for user ${userId}`,
    );
  } catch (err) {
    logger.error("Get student profile error:", err);
    throw err;
  }
};

const getAllStudents = async (page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;

    const students = await StudentProfile.find()
      .populate("user_id", "email role created_at")
      .skip(skip)
      .limit(limit)
      .sort({ created_at: -1 });

    const total = await StudentProfile.countDocuments();

    return {
      data: students,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (err) {
    logger.error("Get all students error:", err);
    throw err;
  }
};

const updateStudentProfile = async (userId, updateData) => {
  try {
    const student = await StudentProfile.findOneAndUpdate(
      { user_id: userId },
      updateData,
      { new: true, runValidators: true },
    ).populate("user_id", "email role created_at");

    return throwIfNotFound(
      student,
      `Student profile not found for user ${userId}`,
    );
  } catch (err) {
    logger.error("Update student profile error:", err);
    throw err;
  }
};

module.exports = { getStudentProfile, getAllStudents, updateStudentProfile };
