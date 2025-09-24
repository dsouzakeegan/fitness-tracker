const httpStatusCodes = require("http-status-codes");

const { ProgressService } = require("../services/services.index");
const { LoggerUtils } = require('../utils/utils.index');

const _progressService = new ProgressService();
const _loggerUtils = new LoggerUtils();

class ProgressController {
    async getUserProgress(req, res) {
        try {
            const userId = req.user.id || req.user._id;
            const timeframe = req.query.timeframe || '3months';
            
            const response = await _progressService.getProgressByTimeframe(userId, timeframe);
            
            if (response.status) {
                return res.status(httpStatusCodes.StatusCodes.OK).json(response);
            } else {
                return res.status(httpStatusCodes.StatusCodes.PRECONDITION_FAILED).json(response);
            }
        } catch (err) {
            handleError(req, res, err);
        }
    }

    async updateBodyMeasurement(req, res) {
        try {
            const userId = req.user.id || req.user._id;
            const measurementData = req.body;
            
            const response = await _progressService.updateBodyMeasurement(userId, measurementData);
            
            if (response.status) {
                return res.status(httpStatusCodes.StatusCodes.OK).json(response);
            } else {
                return res.status(httpStatusCodes.StatusCodes.PRECONDITION_FAILED).json(response);
            }
        } catch (err) {
            handleError(req, res, err);
        }
    }

    async updateStrengthProgress(req, res) {
        try {
            const userId = req.user.id || req.user._id;
            const strengthData = req.body;
            
            const response = await _progressService.updateStrengthProgress(userId, strengthData);
            
            if (response.status) {
                return res.status(httpStatusCodes.StatusCodes.OK).json(response);
            } else {
                return res.status(httpStatusCodes.StatusCodes.PRECONDITION_FAILED).json(response);
            }
        } catch (err) {
            handleError(req, res, err);
        }
    }

    async updateFitnessMetrics(req, res) {
        try {
            const userId = req.user.id || req.user._id;
            const metricsData = req.body;
            
            const response = await _progressService.updateFitnessMetrics(userId, metricsData);
            
            if (response.status) {
                return res.status(httpStatusCodes.StatusCodes.OK).json(response);
            } else {
                return res.status(httpStatusCodes.StatusCodes.PRECONDITION_FAILED).json(response);
            }
        } catch (err) {
            handleError(req, res, err);
        }
    }

    async addAchievement(req, res) {
        try {
            const userId = req.user.id || req.user._id;
            const achievementData = req.body;
            
            const response = await _progressService.addAchievement(userId, achievementData);
            
            if (response.status) {
                return res.status(httpStatusCodes.StatusCodes.CREATED).json(response);
            } else {
                return res.status(httpStatusCodes.StatusCodes.PRECONDITION_FAILED).json(response);
            }
        } catch (err) {
            handleError(req, res, err);
        }
    }

    async getProgressStatistics(req, res) {
        try {
            const userId = req.user.id || req.user._id;
            
            const response = await _progressService.getProgressStatistics(userId);
            
            if (response.status) {
                return res.status(httpStatusCodes.StatusCodes.OK).json(response);
            } else {
                return res.status(httpStatusCodes.StatusCodes.PRECONDITION_FAILED).json(response);
            }
        } catch (err) {
            handleError(req, res, err);
        }
    }

    async bulkUpdateProgress(req, res) {
        try {
            const userId = req.user.id || req.user._id;
            const updateData = req.body;
            
            const response = await _progressService.bulkUpdateProgress(userId, updateData);
            
            if (response.status) {
                return res.status(httpStatusCodes.StatusCodes.OK).json(response);
            } else {
                return res.status(httpStatusCodes.StatusCodes.PRECONDITION_FAILED).json(response);
            }
        } catch (err) {
            handleError(req, res, err);
        }
    }
}

module.exports = ProgressController;

const handleError = function(req, res, error) {
    console.error(error);
    _loggerUtils.logError(req, res, error, "progress.controller.js")
    return res.status(httpStatusCodes.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ status: false, message: "INTERNAL_SERVER_ERROR : " + error.message });
};