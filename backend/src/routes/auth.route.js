const express = require("express");

const { AuthController } = require("../controllers/controllers.index");
const { authValidator } = require("../validators/validators.index");
// const { AuthMiddleware } = require("../middleware/middleware.index");

const _router = express.Router();
const _authController = new AuthController();
// const _authMiddleware = new AuthMiddleware();

/* USER SIGNUP :: (POST) => /api/auth/signup */
_router.post("/signup", authValidator.validateSignup, _authController.signUp);

/* USER LOGIN :: (POST) => /api/auth/login */
_router.post("/login", authValidator.validateLogin, _authController.login);

/* USER REFRESH :: (POST) => /api/auth/refresh */
_router.post("/refresh", _authController.refresh);

/* USER LOGOUT :: (GET) => /api/auth/logout */
_router.get("/logout", _authController.logout);

module.exports = _router;