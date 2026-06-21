const studentService = require("../services/student.service");
const logger = require("../utils/logger");

const getProfile = async (req, res, next) => {
  try {
    const profile = await studentService.getStudentProfile(req.user.userId);

    res.status(200).json({
      status: "success",
      data: profile,
    });
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const profile = await studentService.updateStudentProfile(
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

const getAllStudents = async (req, res, next) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    const result = await studentService.getAllStudents(
      parseInt(page),
      parseInt(limit),
    );

    res.status(200).json({
      status: "success",
      data: result.data,
      pagination: result.pagination,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProfile, updateProfile, getAllStudents };
