const express = require('express');
const { WorkoutController } = require('../controllers/controllers.index');
const { AuthMiddleware } = require("../middleware/middleware.index");

const _router = express.Router();
const _workoutController = new WorkoutController();
const _authMiddleware = new AuthMiddleware();

/* LOG WORKOUT :: (POST) => /api/workouts/log */
_router.post('/log', _authMiddleware.verifyAuth, _workoutController.logWorkout);

/* GET WORKOUT ANALYTICS :: (GET) => /api/workouts/analytics */
_router.get('/analytics', _authMiddleware.verifyAuth, _workoutController.getWorkoutAnalytics);

/* GET WORKOUT RECOMMENDATIONS :: (GET) => /api/workouts/recommendations */
_router.get('/recommendations', _authMiddleware.verifyAuth, _workoutController.getWorkoutRecommendations);

/* GET RECENT WORKOUTS :: (GET) => /api/workouts/recent */
_router.get('/recent', _authMiddleware.verifyAuth, _workoutController.getRecentWorkouts);

/* GET MONTHLY PROGRESS :: (GET) => /api/workouts/monthly-progress */
_router.get('/monthly-progress', _authMiddleware.verifyAuth, _workoutController.calculateMonthlyProgress);

module.exports = _router;