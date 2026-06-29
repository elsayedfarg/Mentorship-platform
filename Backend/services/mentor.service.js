const MentorProfile = require("../models/mentorProfile.model");
const MentorAvailability = require("../models/mentorAvailability.model");
const Session = require("../models/session.model");
const Stack = require("../models/stack.model");
const User = require("../models/user.model");
const APIError = require("../utils/APIError");
const logger = require("../utils/logger");
const throwIfNotFound = require("../utils/throwIfNotFound");
const {
  getDayOfWeekFromDateString,
  buildWallClockDateTime,
  generateHourlySlots,
  timeToMinutes,
} = require("../utils/timeUtils");

const getMentorProfile = async (userId) => {
  try {
    const mentor = await MentorProfile.findOne({ user_id: userId })
      .populate("user_id", "email role created_at")
      .populate("stack_id", "name description");

    return throwIfNotFound(mentor, "Mentor profile not found");
  } catch (err) {
    logger.error("Get mentor profile error:", err);
    throw err;
  }
};

const createMentorProfile = async (userId, mentorData) => {
  try {
    const stack = await Stack.findById(mentorData.stack_id);
    throwIfNotFound(stack, "Stack not found");

    const mentor = await MentorProfile.create({
      user_id: userId,
      ...mentorData,
    });

    return mentor.populate("stack_id", "name description");
  } catch (err) {
    logger.error("Create mentor profile error:", err);
    throw err;
  }
};

const getAllMentors = async (filters = {}) => {
  try {
    const {
      stack_id,
      sort_by = "average_rating",
      keyword,
      page = 1,
      limit = 10,
    } = filters;

    const query = { is_verified: true };

    if (stack_id) {
      query.stack_id = stack_id;
    }

    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: "i" } },
        { title: { $regex: keyword, $options: "i" } },
        { bio: { $regex: keyword, $options: "i" } },
      ];
    }

    const sortOptions = {
      average_rating: { average_rating: -1 },
      hourly_rate: { hourly_rate: 1 },
      newest: { created_at: -1 },
    };

    const sort = sortOptions[sort_by] || sortOptions.average_rating;

    const skip = (page - 1) * limit;

    const mentors = await MentorProfile.find(query)
      .populate("user_id", "email created_at")
      .populate("stack_id", "name description")
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await MentorProfile.countDocuments(query);

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
    logger.error("Get all mentors error:", err);
    throw err;
  }
};

const getMentorById = async (mentorId) => {
  try {
    const mentor = await MentorProfile.findById(mentorId)
      .populate("user_id", "email role created_at")
      .populate("stack_id", "name description");

    return throwIfNotFound(mentor, "Mentor not found");
  } catch (err) {
    logger.error("Get mentor by ID error:", err);
    throw err;
  }
};

const updateMentorProfile = async (userId, updateData) => {
  try {
    if (updateData.stack_id) {
      const stack = await Stack.findById(updateData.stack_id);
      throwIfNotFound(stack, "Stack not found");
    }

    const mentor = await MentorProfile.findOneAndUpdate(
      { user_id: userId },
      updateData,
      { new: true, runValidators: true },
    )
      .populate("user_id", "email role created_at")
      .populate("stack_id", "name description");

    return throwIfNotFound(mentor, "Mentor profile not found");
  } catch (err) {
    logger.error("Update mentor profile error:", err);
    throw err;
  }
};

const addAvailabilityBlock = async (userId, { day_of_week, start_time, end_time }) => {
  try {
    const mentor = await MentorProfile.findOne({ user_id: userId });
    throwIfNotFound(mentor, "Mentor profile not found");

    if (start_time >= end_time) {
      throw new APIError("End time must be after start time", 400);
    }

    if (timeToMinutes(end_time) - timeToMinutes(start_time) < 60) {
      throw new APIError("Availability block must be at least 1 hour long", 400);
    }

    const conflict = await MentorAvailability.findOne({
      mentor_id: mentor._id,
      day_of_week,
      start_time: { $lt: end_time },
      end_time: { $gt: start_time },
    });

    if (conflict) {
      throw new APIError(
        `Availability block conflicts with an existing block on ${day_of_week} (${conflict.start_time}–${conflict.end_time})`,
        409
      );
    }

    const availability = await MentorAvailability.create({
      mentor_id: mentor._id,
      day_of_week,
      start_time,
      end_time,
    });

    return availability;
  } catch (err) {
    logger.error("Add availability block error:", err);
    throw err;
  }
};

/**
 * Get mentor availability for a specific date
 */
const getMentorAvailability = async (mentorId, date) => {
  try {
    const mentorProfile = await MentorProfile.findById(mentorId);
    throwIfNotFound(mentorProfile, "Mentor not found");

    if (!date) {
      const availabilityBlocks = await MentorAvailability.find({
        mentor_id: mentorId,
      }).sort({ day_of_week: 1, start_time: 1 });

      return {
        availability_blocks: availabilityBlocks,
      };
    }

    const dayOfWeek = getDayOfWeekFromDateString(date);

    const availabilityBlocks = await MentorAvailability.find({
      mentor_id: mentorId,
      day_of_week: dayOfWeek,
    }).sort({ start_time: 1 });

    const dayStart = buildWallClockDateTime(date, "00:00");
    const dayEnd = buildWallClockDateTime(date, "23:59");

    const bookedSessions = await Session.find({
      mentor_id: mentorId,
      status: { $in: ["Pending", "Accepted"] },
      start_time: { $lt: dayEnd },
      end_time: { $gt: dayStart },
    });

    const slots = generateHourlySlots(availabilityBlocks, date, bookedSessions);

    return {
      date,
      day_of_week: dayOfWeek,
      availability_blocks: availabilityBlocks,
      slots,
    };
  } catch (err) {
    logger.error("Get mentor availability error:", err);
    throw err;
  }
};

/**
 * Get all availability blocks for mentor
 */
const getMentorAllAvailability = async (userId) => {
  try {
    const mentor = await MentorProfile.findOne({ user_id: userId });
    throwIfNotFound(mentor, "Mentor profile not found");

    const availability = await MentorAvailability.find({
      mentor_id: mentor._id,
    });

    return availability;
  } catch (err) {
    logger.error("Get all availability error:", err);
    throw err;
  }
};

/**
 * Remove availability block
 */
const removeAvailabilityBlock = async (userId, blockId) => {
  try {
    const mentor = await MentorProfile.findOne({ user_id: userId });
    throwIfNotFound(mentor, "Mentor profile not found");

    const availability = await MentorAvailability.findOneAndDelete({
      _id: blockId,
      mentor_id: mentor._id,
    });

    throwIfNotFound(availability, "Availability block not found");

    return { message: "Availability block deleted successfully" };
  } catch (err) {
    logger.error("Remove availability block error:", err);
    throw err;
  }
};

module.exports = {
  getMentorProfile,
  createMentorProfile,
  getAllMentors,
  getMentorById,
  updateMentorProfile,
  addAvailabilityBlock,
  getMentorAvailability,
  getMentorAllAvailability,
  removeAvailabilityBlock,
};
