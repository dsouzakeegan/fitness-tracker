const httpStatusCodes = require("http-status-codes");

const { AuthService } = require("../services/services.index");
const { LoggerUtils } = require('../utils/utils.index');

const _authService = new AuthService();
const _loggerUtils = new LoggerUtils();

class AuthController {
    
    async signUp(req, res) {
        try {
            const response = await _authService.signUp(req, res);
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

    async login(req, res) {
        try {
            const response = await _authService.login(req, res);
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

    async refresh(req, res) {
        try {
            const response = await _authService.refresh(req, res);
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
    
    async logout(req, res) {
        try {
            const response = await _authService.logout(req, res);
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

module.exports = AuthController;

const handleError = function(req, res, error) {
    console.error(error);
    _loggerUtils.logError(req, res, error, "auth.controller.js")
    return res.status(httpStatusCodes.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ status: false, message: "INTERNAL_SERVER_ERROR : " + error.message });
}