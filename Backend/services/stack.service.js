const Stack = require("../models/stack.model");
const APIError = require("../utils/APIError");
const logger = require("../utils/logger");
const throwIfNotFound = require("../utils/throwIfNotFound");
const createStack = async (stackData) => {
  try {
    // Check if stack with same name already exists
    const existingStack = await Stack.findOne({
      name: new RegExp(`^${stackData.name}$`, "i"),
    });

    if (existingStack) {
      throw new APIError(
        `Stack with name "${stackData.name}" already exists`,
        409,
      );
    }

    // Create new stack
    const stack = await Stack.create({
      name: stackData.name.trim(),
      description: stackData.description.trim(),
      icon: stackData.icon || null,
      color: stackData.color || "#0F766E",
    });

    logger.info(`Stack created: ${stack.name} (ID: ${stack._id})`);

    return stack;
  } catch (err) {
    logger.error("Create stack error:", err);
    throw err;
  }
};

const getAllStacks = async (page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;

    const stacks = await Stack.find()
      .skip(skip)
      .limit(limit)
      .sort({ created_at: -1 });

    const total = await Stack.countDocuments();

    return {
      data: stacks,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (err) {
    logger.error("Get all stacks error:", err);
    throw err;
  }
};

const getStackById = async (stackId) => {
  try {
    const stack = await Stack.findById(stackId);

    return throwIfNotFound(stack, `Stack with ID ${stackId} not found`);
  } catch (err) {
    logger.error("Get stack by ID error:", err);
    throw err;
  }
};

const getStackByName = async (stackName) => {
  try {
    const stack = await Stack.findOne({
      name: new RegExp(`^${stackName}$`, "i"),
    });

    return throwIfNotFound(stack, `Stack "${stackName}" not found`);
  } catch (err) {
    logger.error("Get stack by name error:", err);
    throw err;
  }
};

const updateStack = async (stackId, updateData) => {
  try {
    // If updating name, check for duplicates
    if (updateData.name) {
      const existingStack = await Stack.findOne({
        _id: { $ne: stackId }, // Exclude current stack
        name: new RegExp(`^${updateData.name}$`, "i"),
      });

      if (existingStack) {
        throw new APIError(
          `Stack with name "${updateData.name}" already exists`,
          409,
        );
      }
    }

    const stack = await Stack.findByIdAndUpdate(
      stackId,
      {
        name: updateData.name ? updateData.name.trim() : undefined,
        description: updateData.description
          ? updateData.description.trim()
          : undefined,
        icon: updateData.icon !== undefined ? updateData.icon : undefined,
        color: updateData.color !== undefined ? updateData.color : undefined,
      },
      { new: true, runValidators: true },
    );

    throwIfNotFound(stack, `Stack with ID ${stackId} not found`);

    logger.info(`Stack updated: ${stack.name} (ID: ${stack._id})`);

    return stack;
  } catch (err) {
    logger.error("Update stack error:", err);
    throw err;
  }
};

const deleteStack = async (stackId) => {
  try {
    const stack = await Stack.findById(stackId);

    throwIfNotFound(stack, `Stack with ID ${stackId} not found`);

    // Check if any mentors use this stack
    const MentorProfile = require("../models/mentorProfile.model");
    const mentorCount = await MentorProfile.countDocuments({
      stack_id: stackId,
    });

    if (mentorCount > 0) {
      throw new APIError(
        `Cannot delete stack. ${mentorCount} mentor(s) are using this stack. 
         Please reassign mentors to another stack first.`,
        409,
      );
    }

    // Delete the stack
    await Stack.findByIdAndDelete(stackId);

    logger.info(`Stack deleted: ${stack.name} (ID: ${stackId})`);

    return {
      message: `Stack "${stack.name}" has been deleted successfully`,
    };
  } catch (err) {
    logger.error("Delete stack error:", err);
    throw err;
  }
};

const getStacksWithStats = async () => {
  try {
    const MentorProfile = require("../models/mentorProfile.model");

    const stacks = await Stack.find().sort({ created_at: -1 });

    // Enrich with mentor count
    const stacksWithStats = await Promise.all(
      stacks.map(async (stack) => {
        const mentorCount = await MentorProfile.countDocuments({
          stack_id: stack._id,
        });

        return {
          ...stack.toObject(),
          mentorCount,
        };
      }),
    );

    return stacksWithStats;
  } catch (err) {
    logger.error("Get stacks with stats error:", err);
    throw err;
  }
};

module.exports = {
  createStack,
  getAllStacks,
  getStackById,
  getStackByName,
  updateStack,
  deleteStack,
  getStacksWithStats,
};
