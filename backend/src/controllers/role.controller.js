const httpStatusCodes = require("http-status-codes");

const { RoleService } = require("../services/services.index");
const { LoggerUtils } = require('../utils/utils.index');

const _roleService = new RoleService();
const _loggerUtils = new LoggerUtils();

class RoleController {
    
    async addRole(req, res) {
        try {
            const response = await _roleService.addRole(req, res);
            if(response.status) {
                return res.status(httpStatusCodes.StatusCodes.CREATED).json(response);
            }
            else {
                return res.status(httpStatusCodes.StatusCodes.PRECONDITION_FAILED).json(response);
            }
        }
        catch(err) {
            handleError(req, res, err);
        }
    }

    async getRoleList(req, res) {
        try {
            const response = await _roleService.getRoleList(req, res);
            if(response.status) {
                return res.status(httpStatusCodes.StatusCodes.CREATED).json(response);
            }
            else {
                return res.status(httpStatusCodes.StatusCodes.PRECONDITION_FAILED).json(response);
            }
        }
        catch(err) {
            handleError(req, res, err);
        }
    }
    
}

module.exports = RoleController;

const handleError = function(req, res, error) {
    console.error(error);
    _loggerUtils.logError(req, res, error, "role.controller.js")
    return res.status(httpStatusCodes.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ status: false, message: "INTERNAL_SERVER_ERROR : " + error.message });
}