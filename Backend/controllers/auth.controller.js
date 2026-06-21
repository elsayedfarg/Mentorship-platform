const authService = require("../services/auth.service");
const logger = require("../utils/logger");

const register = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
    const result = await authService.register(email, password, role);

    res.status(201).json({
      status: "success",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await authService.getProfile(req.user.userId);

    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, getProfile };
