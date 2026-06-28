const adminService = require("../services/admin.service");
const logger = require("../utils/logger");


const getAllUsers = async (req, res, next) => {
  try {
    const result = await adminService.getAllUsers({
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
      role: req.query.role,
    });

    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (err) {
    next(err);
  }
};


const updateUserStatus = async (req, res, next) => {
  try {
    const updatedProfile = await adminService.updateUserStatus(
      req.params.userId,
      req.body.is_verified,
    );

    res.status(200).json({
      success: true,
      data: updatedProfile,
    });
  } catch (err) {
    next(err);
  }
};


const getPendingMentors = async (req, res, next) => {
  try {
    const result = await adminService.getPendingMentors({
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
    });

    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllUsers,
  updateUserStatus,
  getPendingMentors,
};
