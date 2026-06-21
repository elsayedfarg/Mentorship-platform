const mentorService = require("../services/mentor.service");
const logger = require("../utils/logger");

const getProfile = async (req, res, next) => {
  try {
    const profile = await mentorService.getMentorProfile(req.user.userId);

    res.status(200).json({
      status: "success",
      data: profile,
    });
  } catch (err) {
    next(err);
  }
};

const createProfile = async (req, res, next) => {
  try {
    const profile = await mentorService.createMentorProfile(
      req.user.userId,
      req.body,
    );

    res.status(201).json({
      status: "success",
      data: profile,
    });
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const profile = await mentorService.updateMentorProfile(
      req.user.userId,
      req.body,
    );

    res.status(200).json({
      status: "success",
      data: profile,
    });
  } catch (err) {
    next(err);
  }
};

const getAllMentors = async (req, res, next) => {
  try {
    const result = await mentorService.getAllMentors({
      stack_id: req.query.stack,
      sort_by: req.query.sort_by,
      keyword: req.query.keyword,
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
    });

    res.status(200).json({
      status: "success",
      data: result.data,
      pagination: result.pagination,
    });
  } catch (err) {
    next(err);
  }
};

const getMentorById = async (req, res, next) => {
  try {
    const mentor = await mentorService.getMentorById(req.params.id);

    res.status(200).json({
      status: "success",
      data: mentor,
    });
  } catch (err) {
    next(err);
  }
};

const addAvailability = async (req, res, next) => {
  try {
    const availability = await mentorService.addAvailabilityBlock(
      req.user.userId,
      req.body,
    );

    res.status(201).json({
      status: "success",
      data: availability,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get mentor availability for a specific date (Public)
 */
const getAvailability = async (req, res, next) => {
  try {
    const availability = await mentorService.getMentorAvailability(
      req.params.id,
      req.query.date,
    );

    res.status(200).json({
      status: "success",
      data: availability,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get all availability blocks for current mentor (Mentor)
 */
const getAllAvailability = async (req, res, next) => {
  try {
    const availability = await mentorService.getMentorAllAvailability(
      req.user.userId,
    );

    res.status(200).json({
      status: "success",
      data: availability,
    });
  } catch (err) {
    next(err);
  }
};

const removeAvailability = async (req, res, next) => {
  try {
    const result = await mentorService.removeAvailabilityBlock(
      req.user.userId,
      req.params.blockId,
    );

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProfile,
  createProfile,
  updateProfile,
  getAllMentors,
  getMentorById,
  addAvailability,
  getAvailability,
  getAllAvailability,
  removeAvailability,
};
