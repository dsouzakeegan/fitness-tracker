const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, // Each user should have only one progress document
    index: true // Add index for better query performance
  },
  bodyMeasurements: [{
    date: {
      type: Date,
      required: true,
      default: Date.now
    },
    weight: {
      type: Number,
      min: 0,
      max: 1000 // Reasonable max weight in lbs
    },
    bodyFat: {
      type: Number,
      min: 0,
      max: 100 // Percentage
    },
    muscleMass: {
      type: Number,
      min: 0,
      max: 500 // Reasonable max muscle mass in lbs
    }
  }],
  strengthProgress: {
    bench: {
      current: {
        type: Number,
        default: 0,
        min: 0
      },
      best: {
        type: Number,
        default: 0,
        min: 0
      },
      goal: {
        type: Number,
        default: 0,
        min: 0
      }
    },
    squat: {
      current: {
        type: Number,
        default: 0,
        min: 0
      },
      best: {
        type: Number,
        default: 0,
        min: 0
      },
      goal: {
        type: Number,
        default: 0,
        min: 0
      }
    },
    deadlift: {
      current: {
        type: Number,
        default: 0,
        min: 0
      },
      best: {
        type: Number,
        default: 0,
        min: 0
      },
      goal: {
        type: Number,
        default: 0,
        min: 0
      }
    },
    ohp: {
      current: {
        type: Number,
        default: 0,
        min: 0
      },
      best: {
        type: Number,
        default: 0,
        min: 0
      },
      goal: {
        type: Number,
        default: 0,
        min: 0
      }
    }
  },
  fitnessMetrics: [{
    date: {
      type: Date,
      required: true,
      default: Date.now
    },
    metrics: {
      strength: {
        current: {
          type: Number,
          min: 0,
          max: 100,
          default: 0
        },
        goal: {
          type: Number,
          min: 0,
          max: 100,
          default: 100
        }
      },
      endurance: {
        current: {
          type: Number,
          min: 0,
          max: 100,
          default: 0
        },
        goal: {
          type: Number,
          min: 0,
          max: 100,
          default: 100
        }
      },
      flexibility: {
        current: {
          type: Number,
          min: 0,
          max: 100,
          default: 0
        },
        goal: {
          type: Number,
          min: 0,
          max: 100,
          default: 100
        }
      },
      balance: {
        current: {
          type: Number,
          min: 0,
          max: 100,
          default: 0
        },
        goal: {
          type: Number,
          min: 0,
          max: 100,
          default: 100
        }
      },
      power: {
        current: {
          type: Number,
          min: 0,
          max: 100,
          default: 0
        },
        goal: {
          type: Number,
          min: 0,
          max: 100,
          default: 100
        }
      },
      speed: {
        current: {
          type: Number,
          min: 0,
          max: 100,
          default: 0
        },
        goal: {
          type: Number,
          min: 0,
          max: 100,
          default: 100
        }
      }
    }
  }],
  achievements: [{
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    date: {
      type: Date,
      required: true,
      default: Date.now
    },
    type: {
      type: String,
      required: true,
      enum: ['milestone', 'consistency', 'body', 'volume'],
      lowercase: true
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500
    }
  }]
}, {
  timestamps: true
});

// Add indexes for better performance
progressSchema.index({ userId: 1 });
progressSchema.index({ 'bodyMeasurements.date': -1 });
progressSchema.index({ 'fitnessMetrics.date': -1 });
progressSchema.index({ 'achievements.date': -1 });

// Virtual for getting latest body measurements
progressSchema.virtual('latestBodyMeasurement').get(function() {
  if (this.bodyMeasurements && this.bodyMeasurements.length > 0) {
    return this.bodyMeasurements[this.bodyMeasurements.length - 1];
  }
  return null;
});

// Virtual for getting latest fitness metrics
progressSchema.virtual('latestFitnessMetrics').get(function() {
  if (this.fitnessMetrics && this.fitnessMetrics.length > 0) {
    return this.fitnessMetrics[this.fitnessMetrics.length - 1];
  }
  return null;
});

// Method to calculate strength progress percentage
progressSchema.methods.getStrengthProgressPercentage = function(exercise) {
  if (!this.strengthProgress[exercise] || !this.strengthProgress[exercise].goal) {
    return 0;
  }
  
  const current = this.strengthProgress[exercise].current || 0;
  const goal = this.strengthProgress[exercise].goal;
  
  return Math.min(Math.round((current / goal) * 100), 100);
};

// Method to get achievements by type
progressSchema.methods.getAchievementsByType = function(type) {
  return this.achievements.filter(achievement => achievement.type === type);
};

// Method to get recent achievements (last 30 days)
progressSchema.methods.getRecentAchievements = function(days = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return this.achievements.filter(achievement => achievement.date >= cutoffDate);
};

// Pre-save middleware to ensure best is always >= current
progressSchema.pre('save', function(next) {
  if (this.strengthProgress) {
    ['bench', 'squat', 'deadlift', 'ohp'].forEach(exercise => {
      if (this.strengthProgress[exercise]) {
        const current = this.strengthProgress[exercise].current || 0;
        const best = this.strengthProgress[exercise].best || 0;
        
        // Ensure best is always at least as high as current
        if (current > best) {
          this.strengthProgress[exercise].best = current;
        }
      }
    });
  }
  
  // Sort arrays by date (newest first)
  if (this.bodyMeasurements && this.bodyMeasurements.length > 0) {
    this.bodyMeasurements.sort((a, b) => new Date(a.date) - new Date(b.date));
  }
  
  if (this.fitnessMetrics && this.fitnessMetrics.length > 0) {
    this.fitnessMetrics.sort((a, b) => new Date(a.date) - new Date(b.date));
  }
  
  if (this.achievements && this.achievements.length > 0) {
    this.achievements.sort((a, b) => new Date(b.date) - new Date(a.date));
  }
  
  next();
});

// Static method to find or create user progress
progressSchema.statics.findOrCreateUserProgress = async function(userId) {
  let progress = await this.findOne({ userId });
  
  if (!progress) {
    progress = new this({
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
    
    await progress.save();
  }
  
  return progress;
};

// Ensure virtual fields are serialized
progressSchema.set('toJSON', { virtuals: true });
progressSchema.set('toObject', { virtuals: true });

const Progress = mongoose.model('Progress', progressSchema);

module.exports = Progress;