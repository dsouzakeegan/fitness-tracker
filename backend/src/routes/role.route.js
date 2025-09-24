const express = require("express");

const { RoleController } = require("../controllers/controllers.index");
const { roleValidator } = require("../validators/validators.index");
const { AuthMiddleware } = require("../middleware/middleware.index");

const _router = express.Router();
const _roleController = new RoleController();
const _authMiddleware = new AuthMiddleware();

/* ADD ROLE :: (POST) => /api/role/ */
// _router.post("/", _authMiddleware.verifyAuth, _authMiddleware.findUser, _authMiddleware.verifyRole(["admin", "dev-tester"]), roleValidator.validateAddRole, _roleController.addRole);
_router.post("/", roleValidator.validateAddRole, _roleController.addRole);

/* GET ROLES :: (GET) => /api/role/ */
// _router.get("/", _authMiddleware.verifyAuth, _authMiddleware.findUser, _authMiddleware.verifyRole(["admin", "dev-tester"]), _roleController.getRoleList);
_router.get("/", _roleController.getRoleList);

module.exports = _router;