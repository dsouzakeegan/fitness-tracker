const Progress = require('../models/progress.model');

class ProgressService {
  async createUserProgress(userId) {
    try {
      const defaultProgress = new Progress({
        userId,
        bodyMeasurements: [],
        strengthProgress: {
          bench: { current: 0, best: 0, goal: 0 },
          squat: { current: 0, best: 0, goal: 0 },
          deadlift: { current: 0, best: 0, goal: 0 },
          ohp: { current: 0, best: 0, goal: 0 }
        },
        fitnessMetrics: [],
        achievements: []
      });

      await defaultProgress.save();
      return {
        status: true,
        message: 'User progress initialized successfully',
        data: defaultProgress
      };
    } catch (error) {
      console.error('Failed to create user progress:', error);
      return {
        status: false,
        message: error.message
      };
    }
  }

  async getUserProgress(userId) {
    try {
      const progress = await Progress.findOne({ userId });
      if (!progress) {
        return await this.createUserProgress(userId);
      }
      return {
        status: true,
        message: 'User progress retrieved successfully',
        data: progress
      };
    } catch (error) {
      console.error('Failed to get user progress:', error);
      return {
        status: false,
        message: error.message
      };
    }
  }

  async updateBodyMeasurement(userId, measurementData) {
    try {
      const progress = await Progress.findOne({ userId });
      if (!progress) {
        return {
          status: false,
          message: 'Progress data not found'
        };
      }

      // Validate measurement data
      if (!measurementData.weight && !measurementData.bodyFat && !measurementData.muscleMass) {
        return {
          status: false,
          message: 'At least one measurement is required'
        };
      }

      // Add new measurement
      progress.bodyMeasurements.push({
        date: new Date(),
        weight: measurementData.weight,
        bodyFat: measurementData.bodyFat,
        muscleMass: measurementData.muscleMass
      });

      // Keep only last 12 measurements to avoid data bloat
      if (progress.bodyMeasurements.length > 12) {
        progress.bodyMeasurements = progress.bodyMeasurements.slice(-12);
      }

      await progress.save();
      return {
        status: true,
        message: 'Body measurements updated successfully',
        data: progress
      };
    } catch (error) {
      console.error('Failed to update body measurement:', error);
      return {
        status: false,
        message: error.message
      };
    }
  }

  async updateStrengthProgress(userId, exerciseData) {
    try {
      const progress = await Progress.findOne({ userId });
      if (!progress) {
        return {
          status: false,
          message: 'Progress data not found'
        };
      }

      // Validate exercise data
      const validExercises = ['bench', 'squat', 'deadlift', 'ohp'];
      const providedExercises = Object.keys(exerciseData).filter(key => validExercises.includes(key));
      
      if (providedExercises.length === 0) {
        return {
          status: false,
          message: 'At least one valid exercise is required'
        };
      }

      Object.entries(exerciseData).forEach(([exercise, data]) => {
        if (progress.strengthProgress[exercise]) {
          // Update current weight
          progress.strengthProgress[exercise].current = data.current || progress.strengthProgress[exercise].current;
          
          // Update best if current is higher
          if (data.current && data.current > progress.strengthProgress[exercise].best) {
            progress.strengthProgress[exercise].best = data.current;
          }
          
          // Update goal if provided
          if (data.goal) {
            progress.strengthProgress[exercise].goal = data.goal;
          }
        }
      });

      await progress.save();
      return {
        status: true,
        message: 'Strength progress updated successfully',
        data: progress
      };
    } catch (error) {
      console.error('Failed to update strength progress:', error);
      return {
        status: false,
        message: error.message
      };
    }
  }

  async updateFitnessMetrics(userId, metricsData) {
    try {
      const progress = await Progress.findOne({ userId });
      if (!progress) {
        return {
          status: false,
          message: 'Progress data not found'
        };
      }

      // Validate metrics data
      const validMetrics = ['strength', 'endurance', 'flexibility', 'balance', 'power', 'speed'];
      const providedMetrics = Object.keys(metricsData).filter(key => validMetrics.includes(key));
      
      if (providedMetrics.length === 0) {
        return {
          status: false,
          message: 'At least one valid fitness metric is required'
        };
      }

      // Sanitize and validate metric values
      const sanitizedMetrics = {};
      providedMetrics.forEach(metric => {
        const data = metricsData[metric];
        sanitizedMetrics[metric] = {
          current: Math.min(Math.max(Number(data.current || 0), 0), 100),
          goal: Math.min(Math.max(Number(data.goal || 100), 0), 100)
        };
      });

      progress.fitnessMetrics.push({
        date: new Date(),
        metrics: sanitizedMetrics
      });

      // Keep only last 12 metrics entries
      if (progress.fitnessMetrics.length > 12) {
        progress.fitnessMetrics = progress.fitnessMetrics.slice(-12);
      }

      await progress.save();
      return {
        status: true,
        message: 'Fitness metrics updated successfully',
        data: progress
      };
    } catch (error) {
      console.error('Failed to update fitness metrics:', error);
      return {
        status: false,
        message: error.message
      };
    }
  }

  async addAchievement(userId, achievementData) {
    try {
      const progress = await Progress.findOne({ userId });
      if (!progress) {
        return {
          status: false,
          message: 'Progress data not found'
        };
      }

      // Validate achievement data
      if (!achievementData.title || !achievementData.type) {
        return {
          status: false,
          message: 'Title and type are required for achievements'
        };
      }

      // Validate achievement type
      const validTypes = ['milestone', 'consistency', 'body', 'volume'];
      if (!validTypes.includes(achievementData.type)) {
        return {
          status: false,
          message: `Invalid achievement type. Must be one of: ${validTypes.join(', ')}`
        };
      }

      // Check for duplicates
      const existingAchievement = progress.achievements.find(
        achievement => achievement.title === achievementData.title
      );

      if (existingAchievement) {
        return {
          status: false,
          message: 'Achievement already exists'
        };
      }

      progress.achievements.push({
        title: achievementData.title,
        type: achievementData.type,
        description: achievementData.description || '',
        date: new Date()
      });

      await progress.save();
      return {
        status: true,
        message: 'Achievement added successfully',
        data: progress
      };
    } catch (error) {
      console.error('Failed to add achievement:', error);
      return {
        status: false,
        message: error.message
      };
    }
  }

  async getProgressByTimeframe(userId, timeframe) {
    try {
      const progress = await Progress.findOne({ userId });
      if (!progress) {
        return await this.createUserProgress(userId);
      }

      const now = new Date();
      let startDate = new Date();

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
          startDate.setMonth(now.getMonth() - 3); // default to 3 months
      }

      // Transform data to match frontend expectations
      const bodyMeasurements = this.transformBodyMeasurements(
        progress.bodyMeasurements.filter(m => m.date >= startDate)
      );

      // Calculate progress percentages for strength
      const strengthProgress = this.calculateStrengthProgress(progress.strengthProgress);

      // Get latest fitness metrics or create default
      const latestMetrics = this.getLatestFitnessMetrics(
        progress.fitnessMetrics.filter(m => m.date >= startDate)
      );

      const achievements = progress.achievements
        .filter(a => a.date >= startDate)
        .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by newest first

      return {
        status: true,
        message: 'Progress data retrieved successfully',
        data: {
          bodyMeasurements,
          strengthProgress,
          fitnessMetrics: latestMetrics,
          achievements
        }
      };
    } catch (error) {
      console.error('Failed to get progress by timeframe:', error);
      return {
        status: false,
        message: error.message,
        data: {
          bodyMeasurements: { weight: [], bodyFat: [], muscle: [] },
          strengthProgress: {},
          fitnessMetrics: [],
          achievements: []
        }
      };
    }
  }

  // Helper method to transform body measurements for frontend charts
  transformBodyMeasurements(measurements) {
    const weight = [];
    const bodyFat = [];
    const muscle = [];

    measurements.forEach((measurement, index) => {
      const dateStr = measurement.date.toISOString().split('T')[0];
      
      if (measurement.weight !== undefined) {
        const prevWeight = index > 0 ? measurements[index - 1].weight : measurement.weight;
        const change = prevWeight ? measurement.weight - prevWeight : 0;
        
        weight.push({
          date: dateStr,
          value: measurement.weight,
          change
        });
      }

      if (measurement.bodyFat !== undefined) {
        const prevBodyFat = index > 0 ? measurements[index - 1].bodyFat : measurement.bodyFat;
        const change = prevBodyFat ? measurement.bodyFat - prevBodyFat : 0;
        
        bodyFat.push({
          date: dateStr,
          value: measurement.bodyFat,
          change
        });
      }

      if (measurement.muscleMass !== undefined) {
        const prevMuscle = index > 0 ? measurements[index - 1].muscleMass : measurement.muscleMass;
        const change = prevMuscle ? measurement.muscleMass - prevMuscle : 0;
        
        muscle.push({
          date: dateStr,
          value: measurement.muscleMass,
          change
        });
      }
    });

    return { weight, bodyFat, muscle };
  }

  // Helper method to calculate progress percentages
  calculateStrengthProgress(strengthData) {
    const result = {};
    
    Object.entries(strengthData).forEach(([exercise, data]) => {
      const progress = data.goal > 0 ? Math.round((data.current / data.goal) * 100) : 0;
      result[exercise] = {
        ...data,
        progress: Math.min(progress, 100) // Cap at 100%
      };
    });

    return result;
  }

  // Helper method to get latest fitness metrics in frontend format
  getLatestFitnessMetrics(fitnessMetrics) {
    if (fitnessMetrics.length === 0) {
      // Return default metrics if none exist
      return [
        { metric: 'Strength', current: 0, goal: 100 },
        { metric: 'Endurance', current: 0, goal: 100 },
        { metric: 'Flexibility', current: 0, goal: 100 },
        { metric: 'Balance', current: 0, goal: 100 },
        { metric: 'Power', current: 0, goal: 100 },
        { metric: 'Speed', current: 0, goal: 100 }
      ];
    }

    const latest = fitnessMetrics[fitnessMetrics.length - 1];
    return [
      { metric: 'Strength', current: latest.metrics.strength?.current || 0, goal: latest.metrics.strength?.goal || 100 },
      { metric: 'Endurance', current: latest.metrics.endurance?.current || 0, goal: latest.metrics.endurance?.goal || 100 },
      { metric: 'Flexibility', current: latest.metrics.flexibility?.current || 0, goal: latest.metrics.flexibility?.goal || 100 },
      { metric: 'Balance', current: latest.metrics.balance?.current || 0, goal: latest.metrics.balance?.goal || 100 },
      { metric: 'Power', current: latest.metrics.power?.current || 0, goal: latest.metrics.power?.goal || 100 },
      { metric: 'Speed', current: latest.metrics.speed?.current || 0, goal: latest.metrics.speed?.goal || 100 }
    ];
  }

  async getProgressStatistics(userId) {
    try {
      const progress = await Progress.findOne({ userId });
      if (!progress) {
        return {
          status: false,
          message: 'Progress data not found'
        };
      }

      const totalAchievements = progress.achievements.length;
      const thisMonthAchievements = progress.achievements.filter(
        a => a.date >= new Date(new Date().setMonth(new Date().getMonth() - 1))
      ).length;

      // Calculate current streak (mock implementation - you can implement actual streak logic)
      const currentStreak = 30; // This should be calculated based on workout data
      const streakRecord = 45; // This should be stored separately or calculated

      return {
        status: true,
        message: 'Progress statistics retrieved successfully',
        data: {
          totalAchievements,
          thisMonthAchievements,
          currentStreak,
          streakRecord,
          level: Math.floor(totalAchievements / 2) + 1 // Simple level calculation
        }
      };
    } catch (error) {
      console.error('Failed to get progress statistics:', error);
      return {
        status: false,
        message: error.message,
        data: {
          totalAchievements: 0,
          thisMonthAchievements: 0,
          currentStreak: 0,
          streakRecord: 0,
          level: 1
        }
      };
    }
  }

  async bulkUpdateProgress(userId, updateData) {
    try {
      const progress = await Progress.findOne({ userId });
      if (!progress) {
        return {
          status: false,
          message: 'Progress data not found'
        };
      }

      const results = {};
      const { bodyMeasurement, strengthProgress, fitnessMetrics, achievement } = updateData;

      // Update each component if provided
      if (bodyMeasurement) {
        const result = await this.updateBodyMeasurement(userId, bodyMeasurement);
        if (result.status) results.bodyMeasurement = result.data;
      }

      if (strengthProgress) {
        const result = await this.updateStrengthProgress(userId, strengthProgress);
        if (result.status) results.strengthProgress = result.data;
      }

      if (fitnessMetrics) {
        const result = await this.updateFitnessMetrics(userId, fitnessMetrics);
        if (result.status) results.fitnessMetrics = result.data;
      }

      if (achievement) {
        const result = await this.addAchievement(userId, achievement);
        if (result.status) results.achievement = result.data;
      }

      return {
        status: true,
        message: 'Bulk update completed successfully',
        data: results
      };
    } catch (error) {
      console.error('Failed to perform bulk update:', error);
      return {
        status: false,
        message: error.message
      };
    }
  }
}

module.exports = ProgressService;