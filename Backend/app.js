const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
var hpp = require("hpp");
const { xss } = require("express-xss-sanitizer");

const errorHandler = require("./middlewares/errorHandler");

// Routes
const authRouter = require("./routes/auth.routes");
const studentRouter = require("./routes/student.routes");
const mentorRouter = require("./routes/mentor.routes");

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(hpp());
app.use(xss());

// Route Mount
app.use("/api/auth", authRouter);
app.use("/api/students", studentRouter);
app.use("/api/mentors", mentorRouter);

// Global error handler
app.use(errorHandler);

module.exports = app;
