const express = require('express');
const { ProgressController } = require('../controllers/controllers.index');
const { AuthMiddleware } = require("../middleware/middleware.index");

const _router = express.Router();
const _progressController = new ProgressController();
const _authMiddleware = new AuthMiddleware();

/* GET USER PROGRESS :: (GET) => /api/progress?timeframe=3months */
_router.get('/', _authMiddleware.verifyAuth, _progressController.getUserProgress);

/* GET PROGRESS STATISTICS :: (GET) => /api/progress/statistics */
_router.get('/statistics', _authMiddleware.verifyAuth, _progressController.getProgressStatistics);

/* UPDATE BODY MEASUREMENTS :: (POST) => /api/progress/body-measurement */
_router.post('/body-measurement', _authMiddleware.verifyAuth, _progressController.updateBodyMeasurement);

/* UPDATE STRENGTH PROGRESS :: (POST) => /api/progress/strength */
_router.post('/strength', _authMiddleware.verifyAuth, _progressController.updateStrengthProgress);

/* UPDATE FITNESS METRICS :: (POST) => /api/progress/fitness-metrics */
_router.post('/fitness-metrics', _authMiddleware.verifyAuth, _progressController.updateFitnessMetrics);

/* ADD ACHIEVEMENT :: (POST) => /api/progress/achievement */
_router.post('/achievement', _authMiddleware.verifyAuth, _progressController.addAchievement);

/* BULK UPDATE PROGRESS :: (POST) => /api/progress/bulk-update */
_router.post('/bulk-update', _authMiddleware.verifyAuth, _progressController.bulkUpdateProgress);

module.exports = _router;