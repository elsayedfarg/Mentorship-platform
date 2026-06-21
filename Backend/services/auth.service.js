const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const StudentProfile = require("../models/studentProfile.model");
const MentorProfile = require("../models/mentorProfile.model");
const APIError = require("../utils/APIError");
const config = require("../config/env");
const logger = require("../utils/logger");

const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, config.jwtSecret, {
    expiresIn: "7d",
  });
};

const register = async (email, password, role) => {
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new APIError("User with this email already exists", 409);
    }

    const user = await User.create({
      email,
      password_hash: password,
      role,
    });

    logger.info(`User registered: ${email} as ${role}`);

    let profile;
    if (role === "student") {
      profile = await StudentProfile.create({
        user_id: user._id,
      });
    } else if (role === "mentor") {
      profile = await MentorProfile.create({
        user_id: user._id,
      });
    }

    const token = generateToken(user._id, user.role);

    return {
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
      },
    };
  } catch (err) {
    logger.error("Register error:", err);
    throw err;
  }
};

const login = async (email, password) => {
  try {
    const user = await User.findOne({ email }).select("+password_hash");
    if (!user) {
      throw new APIError("Invalid email or password", 401);
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new APIError("Invalid email or password", 401);
    }

    logger.info(`User logged in: ${email}`);

    const token = generateToken(user._id, user.role);

    return {
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
      },
    };
  } catch (err) {
    logger.error("Login error:", err);
    throw err;
  }
};

const getProfile = async (userId) => {
  try {
    const user = await User.findById(userId).select("-password_hash");
    if (!user) {
      throw new APIError("User not found", 404);
    }

    return user;
  } catch (err) {
    logger.error("Get profile error:", err);
    throw err;
  }
};

module.exports = { register, login, getProfile, generateToken };
