const sessionService = require("../services/session.service");
const logger = require("../utils/logger");


const bookSession = async (req, res, next) => {
  try {
    const result = await sessionService.bookSession(req.user.userId, req.body);

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};


const getUserSessions = async (req, res, next) => {
  try {
    const sessions = await sessionService.getUserSessions(req.user.userId);

    res.status(200).json({
      success: true,
      data: sessions,
    });
  } catch (err) {
    next(err);
  }
};


const updateSessionStatus = async (req, res, next) => {
  try {
    const updatedSession = await sessionService.updateSessionStatus(
      req.params.sessionId,
      req.body.status,
      req.user,
    );

    res.status(200).json({
      success: true,
      data: updatedSession,
    });
  } catch (err) {
    next(err);
  }
};



module.exports = {
  bookSession,
  getUserSessions,
  updateSessionStatus,
};
