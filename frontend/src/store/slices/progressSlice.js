import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../auth/AxiosInstance";

// --- FIXED Utility to normalize API response ---
const normalizeProgress = (raw = {}) => {
  // console.log('Raw API Response:', raw);
  
  // Handle nested structure - check if data is wrapped in a 'data' property
  const actualData = raw.data || raw;
  
  // Extract body measurements with multiple fallback paths
  const bodyMeasurements = actualData.bodyMeasurements || {};
  
  const normalized = {
    bodyMeasurements: {
      weight: bodyMeasurements.weight || actualData.weight || [],
      bodyFat: bodyMeasurements.bodyFat || actualData.bodyFat || [],
      muscle: bodyMeasurements.muscle || actualData.muscle || [],
    },
    strengthProgress: actualData.strengthProgress || {},
    fitnessMetrics: actualData.fitnessMetrics || [],
    achievements: actualData.achievements || [],
    statistics: actualData.statistics || {},
  };

  // console.log('Normalized Data:', normalized);
  return normalized;
};

// Async Thunk for fetching progress data
export const fetchProgressData = createAsyncThunk(
  "progress/fetchData",
  async (timeframe = "3months", { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/progress?timeframe=${timeframe}`);
      console.log("Progress Data: ", response.data);
      return response.data;
    } catch (error) {
      console.error("Progress data fetch error:", error);
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch progress data" }
      );
    }
  }
);

// Async Thunk for updating body measurements
export const updateBodyMeasurement = createAsyncThunk(
  "progress/updateBodyMeasurement",
  async (measurementData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/progress/body-measurement",
        measurementData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to update body measurement" }
      );
    }
  }
);

// Async Thunk for updating strength progress
export const updateStrengthProgress = createAsyncThunk(
  "progress/updateStrengthProgress",
  async (strengthData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/progress/strength",
        strengthData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to update strength progress" }
      );
    }
  }
);

// Async Thunk for updating fitness metrics
export const updateFitnessMetrics = createAsyncThunk(
  "progress/updateFitnessMetrics",
  async (metricsData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/progress/fitness-metrics",
        metricsData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to update fitness metrics" }
      );
    }
  }
);

// Async Thunk for adding achievement
export const addAchievement = createAsyncThunk(
  "progress/addAchievement",
  async (achievementData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/progress/achievement",
        achievementData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to add achievement" }
      );
    }
  }
);

// Async Thunk for bulk updating progress
export const bulkUpdateProgress = createAsyncThunk(
  "progress/bulkUpdate",
  async (bulkData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/progress/bulk-update", bulkData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to bulk update progress" }
      );
    }
  }
);

// Async Thunk for fetching progress statistics
export const fetchProgressStatistics = createAsyncThunk(
  "progress/fetchStatistics",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/progress/statistics");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch statistics" }
      );
    }
  }
);

// Initial state
const initialState = {
  bodyMeasurements: {
    weight: [],
    bodyFat: [],
    muscle: [],
  },
  strengthProgress: {
    bench: { current: 0, best: 0, goal: 0, progress: 0 },
    squat: { current: 0, best: 0, goal: 0, progress: 0 },
    deadlift: { current: 0, best: 0, goal: 0, progress: 0 },
    ohp: { current: 0, best: 0, goal: 0, progress: 0 },
  },
  fitnessMetrics: [],
  achievements: [],

  statistics: {
    totalAchievements: 0,
    thisMonthAchievements: 0,
    currentStreak: 0,
    streakRecord: 0,
    level: 1,
  },

  selectedTimeframe: "3months",
  selectedCategory: "body",

  status: "idle",
  updateStatus: "idle",
  error: null,
  updateError: null,

  dataCache: {},
  lastFetch: null,
};

// Progress Slice
const progressSlice = createSlice({
  name: "progress",
  initialState,
  reducers: {
    setSelectedTimeframe: (state, action) => {
      state.selectedTimeframe = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    clearError: (state) => {
      state.error = null;
      state.updateError = null;
    },
    resetProgress: (state) => {
      return {
        ...initialState,
        selectedTimeframe: state.selectedTimeframe,
        selectedCategory: state.selectedCategory,
      };
    },
    addBodyMeasurementOptimistic: (state, action) => {
      const { type, measurement } = action.payload;
      const today = new Date().toISOString().split("T")[0];
      if (state.bodyMeasurements[type]) {
        const newEntry = {
          date: today,
          value: measurement.value,
          change: measurement.change || 0,
        };
        state.bodyMeasurements[type].push(newEntry);
        if (state.bodyMeasurements[type].length > 12) {
          state.bodyMeasurements[type] =
            state.bodyMeasurements[type].slice(-12);
        }
      }
    },
    updateStrengthProgressOptimistic: (state, action) => {
      const strengthData = action.payload;
      Object.entries(strengthData).forEach(([exercise, data]) => {
        if (state.strengthProgress[exercise]) {
          if (data.current !== undefined) {
            state.strengthProgress[exercise].current = data.current;
            if (data.current > state.strengthProgress[exercise].best) {
              state.strengthProgress[exercise].best = data.current;
            }
          }
          if (data.goal !== undefined) {
            state.strengthProgress[exercise].goal = data.goal;
          }
          const goal = state.strengthProgress[exercise].goal;
          const current = state.strengthProgress[exercise].current;
          state.strengthProgress[exercise].progress =
            goal > 0
              ? Math.min(Math.round((current / goal) * 100), 100)
              : 0;
        }
      });
    },
    cacheProgressData: (state, action) => {
      const { timeframe, data } = action.payload;
      state.dataCache[timeframe] = {
        data,
        timestamp: Date.now(),
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProgressData.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProgressData.fulfilled, (state, action) => {
        state.status = "succeeded";
        
        const normalized = normalizeProgress(action.payload);
        // console.log('After normalization:', normalized);

        // FIXED: Use the normalized structure directly
        state.bodyMeasurements = normalized.bodyMeasurements;
        
        // FIXED: Ensure strength progress has proper defaults and structure
        const defaultStrength = {
          current: 0,
          best: 0,
          goal: 0,
          progress: 0,
        };
        
        state.strengthProgress = {
          bench: { ...defaultStrength, ...(normalized.strengthProgress.bench || {}) },
          squat: { ...defaultStrength, ...(normalized.strengthProgress.squat || {}) },
          deadlift: { ...defaultStrength, ...(normalized.strengthProgress.deadlift || {}) },
          ohp: { ...defaultStrength, ...(normalized.strengthProgress.ohp || {}) },
        };

        // FIXED: Use normalized arrays directly
        state.fitnessMetrics = normalized.fitnessMetrics;
        state.achievements = normalized.achievements;
        
        state.statistics = {
          totalAchievements: 0,
          thisMonthAchievements: 0,
          currentStreak: 0,
          streakRecord: 0,
          level: 1,
          ...normalized.statistics,
        };

        // Cache and cleanup
        state.dataCache[state.selectedTimeframe] = {
          data: action.payload,
          timestamp: Date.now(),
        };
        state.lastFetch = Date.now();
        state.error = null;
      })
      .addCase(fetchProgressData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Update Body Measurement
      .addCase(updateBodyMeasurement.fulfilled, (state) => {
        state.updateStatus = "succeeded";
        state.updateError = null;
        state.dataCache = {};
      })
      .addCase(updateBodyMeasurement.pending, (state) => {
        state.updateStatus = "loading";
        state.updateError = null;
      })
      .addCase(updateBodyMeasurement.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.updateError = action.payload;
      })

      // Update Strength Progress
      .addCase(updateStrengthProgress.fulfilled, (state) => {
        state.updateStatus = "succeeded";
        state.updateError = null;
        state.dataCache = {};
      })
      .addCase(updateStrengthProgress.pending, (state) => {
        state.updateStatus = "loading";
        state.updateError = null;
      })
      .addCase(updateStrengthProgress.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.updateError = action.payload;
      })

      // Update Fitness Metrics
      .addCase(updateFitnessMetrics.fulfilled, (state) => {
        state.updateStatus = "succeeded";
        state.updateError = null;
        state.dataCache = {};
      })
      .addCase(updateFitnessMetrics.pending, (state) => {
        state.updateStatus = "loading";
        state.updateError = null;
      })
      .addCase(updateFitnessMetrics.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.updateError = action.payload;
      })

      // Add Achievement
      .addCase(addAchievement.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
        state.updateError = null;
        if (action.meta.arg) {
          state.achievements.unshift({
            ...action.meta.arg,
            date: new Date().toISOString(),
          });
        }
        state.statistics.totalAchievements += 1;
        state.statistics.thisMonthAchievements += 1;
      })
      .addCase(addAchievement.pending, (state) => {
        state.updateStatus = "loading";
        state.updateError = null;
      })
      .addCase(addAchievement.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.updateError = action.payload;
      })

      // Bulk Update Progress
      .addCase(bulkUpdateProgress.fulfilled, (state) => {
        state.updateStatus = "succeeded";
        state.updateError = null;
        state.dataCache = {};
      })
      .addCase(bulkUpdateProgress.pending, (state) => {
        state.updateStatus = "loading";
        state.updateError = null;
      })
      .addCase(bulkUpdateProgress.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.updateError = action.payload;
      })

      // Fetch Statistics
      .addCase(fetchProgressStatistics.fulfilled, (state, action) => {
        if (action.payload) {
          state.statistics = {
            totalAchievements: 0,
            thisMonthAchievements: 0,
            currentStreak: 0,
            streakRecord: 0,
            level: 1,
            ...action.payload,
          };
        }
      });
  },
});

// Selectors
export const selectProgressData = (state) => state.progress;
export const selectBodyMeasurements = (state) => state.progress.bodyMeasurements;
export const selectStrengthProgress = (state) => state.progress.strengthProgress;
export const selectFitnessMetrics = (state) => state.progress.fitnessMetrics;
export const selectAchievements = (state) => state.progress.achievements;
export const selectProgressStatistics = (state) => state.progress.statistics;
export const selectProgressStatus = (state) => state.progress.status;
export const selectUpdateStatus = (state) => state.progress.updateStatus;
export const selectProgressError = (state) => state.progress.error;
export const selectUpdateError = (state) => state.progress.updateError;
export const selectSelectedTimeframe = (state) =>
  state.progress.selectedTimeframe;
export const selectSelectedCategory = (state) =>
  state.progress.selectedCategory;

export const selectLatestBodyMeasurements = (state) => {
  const { weight = [], bodyFat = [], muscle = [] } =
    state.progress.bodyMeasurements || {};
  return {
    weight: weight.length > 0 ? weight[weight.length - 1]?.value || 0 : 0,
    bodyFat: bodyFat.length > 0 ? bodyFat[bodyFat.length - 1]?.value || 0 : 0,
    muscle: muscle.length > 0 ? muscle[muscle.length - 1]?.value || 0 : 0,
  };
};

export const selectProgressLoading = (state) => {
  return (
    state.progress.status === "loading" ||
    state.progress.updateStatus === "loading"
  );
};

export const selectCachedData = (state) => (timeframe) => {
  const cached = state.progress.dataCache[timeframe];
  if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) {
    return cached.data;
  }
  return null;
};

export const {
  setSelectedTimeframe,
  setSelectedCategory,
  clearError,
  resetProgress,
  addBodyMeasurementOptimistic,
  updateStrengthProgressOptimistic,
  cacheProgressData,
} = progressSlice.actions;

export default progressSlice.reducer;