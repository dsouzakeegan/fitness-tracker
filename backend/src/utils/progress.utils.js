// utils/progress.utils.js

const logger = require('./logger.utils');

class ProgressUtils {
  /**
   * Validate body measurement data
   * @param {Object} data - Body measurement data
   * @returns {Object} - Validation result
   */
  static validateBodyMeasurement(data) {
    const errors = [];
    const validatedData = {};

    if (data.weight !== undefined) {
      const weight = Number(data.weight);
      if (isNaN(weight) || weight < 0 || weight > 1000) {
        errors.push('Weight must be a number between 0 and 1000 lbs');
      } else {
        validatedData.weight = weight;
      }
    }

    if (data.bodyFat !== undefined) {
      const bodyFat = Number(data.bodyFat);
      if (isNaN(bodyFat) || bodyFat < 0 || bodyFat > 100) {
        errors.push('Body fat must be a percentage between 0 and 100');
      } else {
        validatedData.bodyFat = bodyFat;
      }
    }

    if (data.muscleMass !== undefined) {
      const muscleMass = Number(data.muscleMass);
      if (isNaN(muscleMass) || muscleMass < 0 || muscleMass > 500) {
        errors.push('Muscle mass must be a number between 0 and 500 lbs');
      } else {
        validatedData.muscleMass = muscleMass;
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      data: validatedData
    };
  }

  /**
   * Validate strength progress data
   * @param {Object} data - Strength progress data
   * @returns {Object} - Validation result
   */
  static validateStrengthProgress(data) {
    const errors = [];
    const validatedData = {};
    const validExercises = ['bench', 'squat', 'deadlift', 'ohp'];

    Object.entries(data).forEach(([exercise, exerciseData]) => {
      if (!validExercises.includes(exercise)) {
        errors.push(`Invalid exercise: ${exercise}. Valid exercises are: ${validExercises.join(', ')}`);
        return;
      }

      const validatedExercise = {};

      if (exerciseData.current !== undefined) {
        const current = Number(exerciseData.current);
        if (isNaN(current) || current < 0) {
          errors.push(`Current weight for ${exercise} must be a positive number`);
        } else {
          validatedExercise.current = current;
        }
      }

      if (exerciseData.goal !== undefined) {
        const goal = Number(exerciseData.goal);
        if (isNaN(goal) || goal < 0) {
          errors.push(`Goal weight for ${exercise} must be a positive number`);
        } else {
          validatedExercise.goal = goal;
        }
      }

      if (Object.keys(validatedExercise).length > 0) {
        validatedData[exercise] = validatedExercise;
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      data: validatedData
    };
  }

  /**
   * Validate fitness metrics data
   * @param {Object} data - Fitness metrics data
   * @returns {Object} - Validation result
   */
  static validateFitnessMetrics(data) {
    const errors = [];
    const validatedData = {};
    const validMetrics = ['strength', 'endurance', 'flexibility', 'balance', 'power', 'speed'];

    Object.entries(data).forEach(([metric, metricData]) => {
      if (!validMetrics.includes(metric)) {
        errors.push(`Invalid metric: ${metric}. Valid metrics are: ${validMetrics.join(', ')}`);
        return;
      }

      const validatedMetric = {};

      if (metricData.current !== undefined) {
        const current = Number(metricData.current);
        if (isNaN(current) || current < 0 || current > 100) {
          errors.push(`Current value for ${metric} must be between 0 and 100`);
        } else {
          validatedMetric.current = current;
        }
      }

      if (metricData.goal !== undefined) {
        const goal = Number(metricData.goal);
        if (isNaN(goal) || goal < 0 || goal > 100) {
          errors.push(`Goal value for ${metric} must be between 0 and 100`);
        } else {
          validatedMetric.goal = goal;
        }
      }

      if (Object.keys(validatedMetric).length > 0) {
        validatedData[metric] = validatedMetric;
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      data: validatedData
    };
  }

  /**
   * Calculate progress percentage
   * @param {number} current - Current value
   * @param {number} goal - Goal value
   * @returns {number} - Progress percentage (0-100)
   */
  static calculateProgressPercentage(current, goal) {
    if (!goal || goal <= 0) return 0;
    return Math.min(Math.round((current / goal) * 100), 100);
  }

  /**
   * Calculate change between two values
   * @param {number} current - Current value
   * @param {number} previous - Previous value
   * @returns {number} - Change amount
   */
  static calculateChange(current, previous) {
    if (previous === undefined || previous === null) return 0;
    return current - previous;
  }

  /**
   * Calculate percentage change between two values
   * @param {number} current - Current value
   * @param {number} previous - Previous value
   * @returns {number} - Percentage change
   */
  static calculatePercentageChange(current, previous) {
    if (previous === undefined || previous === null || previous === 0) return 0;
    return Math.round(((current - previous) / previous) * 100);
  }

  /**
   * Get timeframe start date
   * @param {string} timeframe - Timeframe ('1month', '3months', '6months', '1year')
   * @returns {Date} - Start date for the timeframe
   */
  static getTimeframeStartDate(timeframe) {
    const now = new Date();
    const startDate = new Date();

    switch (timeframe) {
      case '1month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case '3months':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case '6months':
        startDate.setMonth(now.getMonth() - 6);
        break;
      case '1year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(now.getMonth() - 3); // Default to 3 months
    }

    return startDate;
  }

  /**
   * Format date for frontend consumption
   * @param {Date} date - Date to format
   * @returns {string} - Formatted date string (YYYY-MM-DD)
   */
  static formatDateForFrontend(date) {
    return date.toISOString().split('T')[0];
  }

  /**
   * Generate achievement suggestions based on progress
   * @param {Object} progressData - User's progress data
   * @returns {Array} - Array of suggested achievements
   */
  static generateAchievementSuggestions(progressData) {
    const suggestions = [];

    // Check for strength milestones
    if (progressData.strengthProgress) {
      Object.entries(progressData.strengthProgress).forEach(([exercise, data]) => {
        const milestones = [100, 135, 185, 225, 275, 315, 365, 405, 495];
        const nextMilestone = milestones.find(m => m > data.current);
        
        if (nextMilestone && data.current >= (nextMilestone - 10)) {
          suggestions.push({
            title: `${nextMilestone}lb ${exercise.toUpperCase()}`,
            type: 'milestone',
            description: `You're close to reaching ${nextMilestone}lbs on ${exercise}!`
          });
        }
      });
    }

    // Check for body composition achievements
    if (progressData.bodyMeasurements && progressData.bodyMeasurements.length > 1) {
      const latest = progressData.bodyMeasurements[progressData.bodyMeasurements.length - 1];
      const previous = progressData.bodyMeasurements[progressData.bodyMeasurements.length - 2];

      if (latest.weight && previous.weight && (previous.weight - latest.weight) >= 5) {
        suggestions.push({
          title: '5lb Weight Loss',
          type: 'body',
          description: 'Congratulations on losing 5 pounds!'
        });
      }

      if (latest.muscleMass && previous.muscleMass && (latest.muscleMass - previous.muscleMass) >= 2) {
        suggestions.push({
          title: '2lb Muscle Gain',
          type: 'body',
          description: 'Great job gaining 2 pounds of muscle!'
        });
      }
    }

    return suggestions;
  }

  /**
   * Calculate fitness level based on all metrics
   * @param {Object} progressData - User's progress data
   * @returns {number} - Overall fitness level (1-20)
   */
  static calculateFitnessLevel(progressData) {
    let totalPoints = 0;

    // Points from achievements (1 point each, max 50)
    const achievementPoints = Math.min((progressData.achievements?.length || 0), 50);
    totalPoints += achievementPoints;

    // Points from strength progress (max 40 points)
    if (progressData.strengthProgress) {
      let strengthPoints = 0;
      Object.values(progressData.strengthProgress).forEach(exercise => {
        if (exercise.current > 0) {
          strengthPoints += Math.min(exercise.current / 50, 10); // Max 10 points per exercise
        }
      });
      totalPoints += Math.min(strengthPoints, 40);
    }

    // Points from fitness metrics (max 30 points)
    if (progressData.fitnessMetrics && progressData.fitnessMetrics.length > 0) {
      const latest = progressData.fitnessMetrics[progressData.fitnessMetrics.length - 1];
      const metricsAverage = Object.values(latest.metrics).reduce((sum, metric) => 
        sum + (metric.current || 0), 0) / Object.keys(latest.metrics).length;
      totalPoints += (metricsAverage / 100) * 30;
    }

    // Convert total points to level (1-20)
    return Math.min(Math.floor(totalPoints / 6) + 1, 20);
  }

  /**
   * Generate progress insights
   * @param {Object} progressData - User's progress data
   * @returns {Array} - Array of progress insights
   */
  static generateProgressInsights(progressData) {
    const insights = [];

    // Body measurement insights
    if (progressData.bodyMeasurements && progressData.bodyMeasurements.length >= 2) {
      const latest = progressData.bodyMeasurements[progressData.bodyMeasurements.length - 1];
      const previous = progressData.bodyMeasurements[progressData.bodyMeasurements.length - 2];

      if (latest.weight && previous.weight) {
        const weightChange = latest.weight - previous.weight;
        if (weightChange < -1) {
          insights.push({
            type: 'positive',
            message: `You've lost ${Math.abs(weightChange).toFixed(1)} lbs since your last measurement!`
          });
        } else if (weightChange > 1) {
          insights.push({
            type: 'neutral',
            message: `Your weight has increased by ${weightChange.toFixed(1)} lbs. Consider if this aligns with your goals.`
          });
        }
      }

      if (latest.muscleMass && previous.muscleMass) {
        const muscleChange = latest.muscleMass - previous.muscleMass;
        if (muscleChange > 0.5) {
          insights.push({
            type: 'positive',
            message: `Great job! You've gained ${muscleChange.toFixed(1)} lbs of muscle mass.`
          });
        }
      }
    }

    // Strength insights
    if (progressData.strengthProgress) {
      Object.entries(progressData.strengthProgress).forEach(([exercise, data]) => {
        if (data.goal && data.current) {
          const progress = this.calculateProgressPercentage(data.current, data.goal);
          if (progress >= 90) {
            insights.push({
              type: 'positive',
              message: `You're ${progress}% toward your ${exercise} goal! Time to set a new target?`
            });
          }
        }
      });
    }

    return insights;
  }
}

module.exports = ProgressUtils;