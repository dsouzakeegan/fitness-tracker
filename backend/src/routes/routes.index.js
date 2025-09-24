const express = require("express");

const authRouter = require("./auth.route");
const roleRouter = require("./role.route");
const workoutRouter = require("./workout.route");
const progressRouter = require("./progress.route");
const paymentRouter = require("./payment.route");

const _router = express.Router();

_router.use("/auth", authRouter);
_router.use("/role", roleRouter);
_router.use("/workout",workoutRouter);
_router.use("/progress", progressRouter);
_router.use("/", paymentRouter); // This will handle all payment and subscription routes

module.exports = _router;