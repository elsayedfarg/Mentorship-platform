const stackService = require("../services/stack.service");
const logger = require("../utils/logger");

const createStack = async (req, res, next) => {
  try {
    const stack = await stackService.createStack(req.body);

    res.status(201).json({
      status: "success",
      data: stack,
    });
  } catch (err) {
    next(err);
  }
};

const getAllStacks = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await stackService.getAllStacks(page, limit);

    res.status(200).json({
      status: "success",
      data: result.data,
      pagination: result.pagination,
    });
  } catch (err) {
    next(err);
  }
};

const getStacksWithStats = async (req, res, next) => {
  try {
    const stacks = await stackService.getStacksWithStats();

    res.status(200).json({
      status: "success",
      data: stacks,
    });
  } catch (err) {
    next(err);
  }
};

const getStackById = async (req, res, next) => {
  try {
    const stack = await stackService.getStackById(req.params.id);

    res.status(200).json({
      status: "success",
      data: stack,
    });
  } catch (err) {
    next(err);
  }
};

const updateStack = async (req, res, next) => {
  try {
    const stack = await stackService.updateStack(req.params.id, req.body);

    res.status(200).json({
      status: "success",
      data: stack,
    });
  } catch (err) {
    next(err);
  }
};

const deleteStack = async (req, res, next) => {
  try {
    const result = await stackService.deleteStack(req.params.id);

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createStack,
  getAllStacks,
  getStacksWithStats,
  getStackById,
  updateStack,
  deleteStack,
};
