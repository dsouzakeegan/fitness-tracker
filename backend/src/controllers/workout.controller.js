const httpStatusCodes = require("http-status-codes");

const { WorkoutService } = require("../services/services.index");
const { LoggerUtils } = require('../utils/utils.index');

const _workoutService = new WorkoutService();
const _loggerUtils = new LoggerUtils();

class WorkoutController {
    async logWorkout(req, res) {
        try {
            const userId = req.user.id || req.user._id;
            const workoutData = req.body;
            
            const response = await _workoutService.logWorkout(userId, workoutData);            
            
            if (response.status) {
                return res.status(httpStatusCodes.StatusCodes.CREATED).json(response);
            } else {
                return res.status(httpStatusCodes.StatusCodes.PRECONDITION_FAILED).json(response);
            }
        } catch (err) {
            handleError(req, res, err);
        }
    }

    async getWorkoutAnalytics(req, res) {
        try {
            const userId = req.user.id || req.user._id;
            const period = req.query.period || 'month';
            
            const response = await _workoutService.getWorkoutAnalytics(userId, period);
            
            if (response.status) {
                return res.status(httpStatusCodes.StatusCodes.OK).json(response);
            } else {
                return res.status(httpStatusCodes.StatusCodes.PRECONDITION_FAILED).json(response);
            }
        } catch (err) {
            handleError(req, res, err);
        }
    }

    async getWorkoutRecommendations(req, res) {
        try {
            const userId = req.user.id || req.user._id;
            
            const response = await _workoutService.getWorkoutRecommendations(userId);
            
            if (response.status) {
                return res.status(httpStatusCodes.StatusCodes.OK).json(response);
            } else {
                return res.status(httpStatusCodes.StatusCodes.PRECONDITION_FAILED).json(response);
            }
        } catch (err) {
            handleError(req, res, err);
        }
    }

    async getRecentWorkouts(req, res) {
        try {
            const userId = req.user.id || req.user._id;
            const limit = parseInt(req.query.limit) || 10;
            
            const response = await _workoutService.getRecentWorkouts(userId, limit);
            
            if (response.status) {
                return res.status(httpStatusCodes.StatusCodes.OK).json(response);
            } else {
                return res.status(httpStatusCodes.StatusCodes.PRECONDITION_FAILED).json(response);
            }
        } catch (err) {
            handleError(req, res, err);
        }
    }

    async calculateMonthlyProgress(req, res) {
        try {
            const userId = req.user.id || req.user._id;
            
            const response = await _workoutService.calculateMonthlyProgress(userId);
            
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

module.exports = WorkoutController;

const handleError = function(req, res, error) {
    console.error(error);
    _loggerUtils.logError(req, res, error, "workout.controller.js")
    return res.status(httpStatusCodes.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ status: false, message: "INTERNAL_SERVER_ERROR : " + error.message });
};