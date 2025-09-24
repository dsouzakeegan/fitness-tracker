const mongoose = require('mongoose');

const ExerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  sets: {
    type: Number,
    default: 0,
    min: 0
  },
  reps: {
    type: Number,
    default: 0,
    min: 0
  },
  weight: {
    type: Number,
    default: 0,
    min: 0
  }
});

const WorkoutSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  workoutType: {
    type: String,
    enum: ['Strength', 'Cardio', 'Flexibility', 'HIIT', 'Other'],
    required: true
  },
  duration: {
    type: Number, // in minutes
    required: true,
    min: 0
  },
  intensity: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Extreme'],
    default: 'Medium'
  },
  exercises: [ExerciseSchema],
  notes: {
    type: String,
    trim: true
  },
  caloriesBurned: {
    type: Number,
    default: 0,
    min: 0
  },
  date: {
    type: Date,
    default: Date.now
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual to calculate estimated calories burned based on workout details
WorkoutSchema.virtual('estimatedCalories').get(function() {
  const intensityMultiplier = {
    'Low': 3,
    'Medium': 5,
    'High': 8,
    'Extreme': 12
  };

  const baseCalorieRate = intensityMultiplier[this.intensity] || 5;
  return Math.round(this.duration * baseCalorieRate);
});

// Pre-save hook to calculate calories if not manually set
WorkoutSchema.pre('save', function(next) {
  if (!this.caloriesBurned || this.caloriesBurned === 0) {
    this.caloriesBurned = this.estimatedCalories;
  }
  next();
});

// Method to get workout analytics
WorkoutSchema.statics.getAnalytics = async function(userId, period = 'month') {
  try {
    const periodMap = {
      'week': 7,
      'month': 30,
      'year': 365
    };

    const daysBack = periodMap[period] || 30;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysBack);

    console.log(`Getting analytics for user ${userId}, period: ${period}, cutoff date: ${cutoffDate}`);

    const workouts = await this.find({
      user: userId,
      date: { $gte: cutoffDate }
    }).exec();

    console.log(`Found ${workouts.length} workouts for analytics`);

    // Aggregate workout insights
    const analytics = {
      totalWorkouts: workouts.length,
      totalCaloriesBurned: workouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0),
      workoutTypeBreakdown: this.calculateWorkoutTypeBreakdown(workouts),
      intensityDistribution: this.calculateIntensityDistribution(workouts),
      progressTrends: this.calculateProgressTrends(workouts)
    };

    console.log('Analytics result:', analytics);
    return analytics;
  } catch (error) {
    console.error('Error in getAnalytics:', error);
    return {
      totalWorkouts: 0,
      totalCaloriesBurned: 0,
      workoutTypeBreakdown: {},
      intensityDistribution: {},
      progressTrends: { durationTrend: [], caloriesTrend: [] }
    };
  }
};

// Helper method to calculate workout type breakdown
WorkoutSchema.statics.calculateWorkoutTypeBreakdown = function(workouts) {
  const typeBreakdown = {};
  workouts.forEach(workout => {
    const type = workout.workoutType || 'Other';
    typeBreakdown[type] = (typeBreakdown[type] || 0) + 1;
  });
  return typeBreakdown;
};

// Helper method to calculate intensity distribution
WorkoutSchema.statics.calculateIntensityDistribution = function(workouts) {
  const intensityDistribution = {};
  workouts.forEach(workout => {
    const intensity = workout.intensity || 'Medium';
    intensityDistribution[intensity] = (intensityDistribution[intensity] || 0) + 1;
  });
  return intensityDistribution;
};

// Helper method to calculate progress trends
WorkoutSchema.statics.calculateProgressTrends = function(workouts) {
  // Sort workouts by date
  const sortedWorkouts = workouts.sort((a, b) => new Date(a.date) - new Date(b.date));
  
  return {
    caloriesTrend: sortedWorkouts.map(w => w.caloriesBurned || 0),
    durationTrend: sortedWorkouts.map(w => w.duration || 0)
  };
};

// Method to get personalized recommendations
WorkoutSchema.statics.getRecommendations = async function(userId) {
  try {
    const recentWorkouts = await this.find({ user: userId })
      .sort({ date: -1 })
      .limit(10)
      .exec();

    console.log(`Found ${recentWorkouts.length} recent workouts for recommendations`);

    // Basic recommendation logic
    const recommendations = {
      suggestedWorkoutTypes: this.suggestWorkoutTypes(recentWorkouts),
      intensityAdjustment: this.suggestIntensityAdjustment(recentWorkouts)
    };

    return recommendations;
  } catch (error) {
    console.error('Error in getRecommendations:', error);
    return {
      suggestedWorkoutTypes: ['Cardio', 'Strength'],
      intensityAdjustment: 'Keep up the good work!'
    };
  }
};

// Helper method to suggest workout types
WorkoutSchema.statics.suggestWorkoutTypes = function(recentWorkouts) {
  if (recentWorkouts.length === 0) {
    return ['Cardio', 'Strength'];
  }

  const typeFrequency = this.calculateWorkoutTypeBreakdown(recentWorkouts);
  const allTypes = ['Strength', 'Cardio', 'Flexibility', 'HIIT', 'Other'];
  
  // Find types that haven't been done recently
  const missingTypes = allTypes.filter(type => !typeFrequency[type]);
  
  if (missingTypes.length > 0) {
    return missingTypes.slice(0, 2);
  }
  
  // If all types are covered, suggest the least frequent ones
  const leastFrequentTypes = Object.entries(typeFrequency)
    .sort((a, b) => a[1] - b[1])
    .slice(0, 2)
    .map(entry => entry[0]);

  return leastFrequentTypes.length ? leastFrequentTypes : ['Cardio', 'Strength'];
};

// Helper method to suggest intensity adjustment
WorkoutSchema.statics.suggestIntensityAdjustment = function(recentWorkouts) {
  if (recentWorkouts.length === 0) {
    return 'Start with medium intensity workouts and gradually increase!';
  }

  const intensityDistribution = this.calculateIntensityDistribution(recentWorkouts);
  const totalWorkouts = recentWorkouts.length;
  
  const lowPercentage = (intensityDistribution['Low'] || 0) / totalWorkouts;
  const extremePercentage = (intensityDistribution['Extreme'] || 0) / totalWorkouts;
  
  if (lowPercentage > 0.7) {
    return 'Consider increasing workout intensity for better results!';
  }
  if (extremePercentage > 0.5) {
    return 'Great intensity! Make sure to include rest days to avoid overtraining.';
  }
  
  return 'Your workout intensity distribution looks balanced!';
};

const Workout = mongoose.model('Workout', WorkoutSchema);

module.exports = Workout;