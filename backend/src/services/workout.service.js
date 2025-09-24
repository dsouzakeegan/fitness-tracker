const Workout = require('../models/workout.model');

class WorkoutService {
  async logWorkout(userId, workoutData) {
    try {
      // Validate workout data
      const workout = new Workout({
        ...workoutData,
        user: userId
      });

      // Optional: Add custom validation or preprocessing logic
      if (workout.duration <= 0) {
        return {
          status: false,
          message: 'Workout duration must be greater than 0'
        };
      }

      await workout.save();
      return {
        status: true,
        message: 'Workout logged successfully',
        data: workout
      };
    } catch (error) {
      console.error('Failed to log workout:', error);
      return {
        status: false,
        message: error.message
      };
    }
  }

  async getWorkoutAnalytics(userId, period = 'month') {
    try {
      const analytics = await Workout.getAnalytics(userId, period);
      
      // Return the analytics data directly at the root level
      // This matches what the frontend expects
      return {
        status: true,
        message: 'Workout analytics retrieved successfully',
        // Spread the analytics data at the root level
        totalWorkouts: analytics.totalWorkouts || 0,
        totalCaloriesBurned: analytics.totalCaloriesBurned || 0,
        workoutTypeBreakdown: analytics.workoutTypeBreakdown || {},
        intensityDistribution: analytics.intensityDistribution || {},
        progressTrends: analytics.progressTrends || { durationTrend: [], caloriesTrend: [] }
      };
    } catch (error) {
      console.error('Failed to retrieve workout analytics:', error);
      return {
        status: false,
        message: error.message,
        totalWorkouts: 0,
        totalCaloriesBurned: 0,
        workoutTypeBreakdown: {},
        intensityDistribution: {},
        progressTrends: { durationTrend: [], caloriesTrend: [] }
      };
    }
  }

  async getWorkoutRecommendations(userId) {
    try {
      const recommendations = await Workout.getRecommendations(userId);
      return {
        status: true,
        message: 'Workout recommendations generated successfully',
        // Return recommendations at the root level
        suggestedWorkoutTypes: recommendations.suggestedWorkoutTypes || [],
        intensityAdjustment: recommendations.intensityAdjustment || 'Keep up the good work!'
      };
    } catch (error) {
      console.error('Failed to generate workout recommendations:', error);
      return {
        status: false,
        message: error.message,
        suggestedWorkoutTypes: [],
        intensityAdjustment: 'Unable to generate recommendations at this time.'
      };
    }
  }

  async getRecentWorkouts(userId, limit = 10) {
    try {
      const recentWorkouts = await Workout.find({ user: userId })
        .sort({ date: -1 })
        .limit(limit);
      
      return {
        status: true,
        message: 'Recent workouts retrieved successfully',
        data: recentWorkouts
      };
    } catch (error) {
      console.error('Failed to retrieve recent workouts:', error);
      return {
        status: false,
        message: error.message,
        data: []
      };
    }
  }

  async calculateMonthlyProgress(userId) {
    try {
      const workouts = await Workout.find({
        user: userId,
        date: {
          $gte: new Date(new Date().setMonth(new Date().getMonth() - 1))
        }
      });

      const totalWorkouts = workouts.length;
      const totalCaloriesBurned = workouts.reduce((sum, w) => sum + w.caloriesBurned, 0);
      const avgWorkoutDuration = workouts.reduce((sum, w) => sum + w.duration, 0) / totalWorkouts || 0;

      return {
        status: true,
        message: 'Monthly progress calculated successfully',
        data: {
          totalWorkouts,
          totalCaloriesBurned,
          avgWorkoutDuration: Math.round(avgWorkoutDuration)
        }
      };
    } catch (error) {
      console.error('Failed to calculate monthly progress:', error);
      return {
        status: false,
        message: error.message,
        data: {
          totalWorkouts: 0,
          totalCaloriesBurned: 0,
          avgWorkoutDuration: 0
        }
      };
    }
  }
}

module.exports = WorkoutService;