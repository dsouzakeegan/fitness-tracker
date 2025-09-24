import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../auth/AxiosInstance";

// Async Thunk for logging a workout
export const logWorkout = createAsyncThunk(
  "workout/logWorkout",
  async ({ workoutData, navigate }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/workout/log", workoutData);
      // Navigate to dashboard on success
      if (navigate) {
        navigate('/dashboard');
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to log workout" });
    }
  }
);

// Async Thunk for fetching workout analytics
export const fetchWorkoutAnalytics = createAsyncThunk(
  "workout/fetchAnalytics",
  async (period = 'month', { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/workout/analytics?period=${period}`);
      console.log('Analytics response:', response.data); // Debug log
      return response.data;
    } catch (error) {
      console.error('Analytics fetch error:', error);
      return rejectWithValue(error.response?.data || { message: "Failed to fetch workout analytics" });
    }
  }
);

// Async Thunk for fetching workout recommendations
export const fetchWorkoutRecommendations = createAsyncThunk(
  "workout/fetchRecommendations",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/workout/recommendations");
      console.log('Recommendations response:', response.data); // Debug log
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to fetch workout recommendations" });
    }
  }
);

// Initial state
const initialState = {
  workoutAnalytics: null,
  recommendations: null,
  recentWorkouts: [],
  status: 'idle',
  error: null,
  selectedPeriod: 'month',
  activePanelId: '1' // '1' for dashboard panel, '3' for workout panel
};

// Workout Slice
const workoutSlice = createSlice({
  name: "workout",
  initialState,
  reducers: {
    // Reducer to update selected period
    setSelectedPeriod: (state, action) => {
      state.selectedPeriod = action.payload;
    },
    // Clear error reducer
    clearError: (state) => {
      state.error = null;
    },
    // Set active panel
    setActivePanel: (state, action) => {
      state.activePanelId = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Log Workout Reducers
      .addCase(logWorkout.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(logWorkout.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
        // Reset analytics to trigger refetch
        state.workoutAnalytics = null;
        // Switch to dashboard panel
        state.activePanelId = '1';
      })
      .addCase(logWorkout.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Fetch Analytics Reducers
      .addCase(fetchWorkoutAnalytics.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchWorkoutAnalytics.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Extract the analytics data from the response
        const response = action.payload;
        
        if (response.status) {
          // Structure the analytics data as expected by the frontend
          state.workoutAnalytics = {
            totalWorkouts: response.totalWorkouts || 0,
            totalCaloriesBurned: response.totalCaloriesBurned || 0,
            workoutTypeBreakdown: response.workoutTypeBreakdown || {},
            intensityDistribution: response.intensityDistribution || {},
            progressTrends: response.progressTrends || { durationTrend: [], caloriesTrend: [] }
          };
        } else {
          // If status is false, set empty analytics
          state.workoutAnalytics = {
            totalWorkouts: 0,
            totalCaloriesBurned: 0,
            workoutTypeBreakdown: {},
            intensityDistribution: {},
            progressTrends: { durationTrend: [], caloriesTrend: [] }
          };
        }
        state.error = null;
      })
      .addCase(fetchWorkoutAnalytics.rejected, (state, action) => {
        state.status = 'failed';
        state.workoutAnalytics = {
          totalWorkouts: 0,
          totalCaloriesBurned: 0,
          workoutTypeBreakdown: {},
          intensityDistribution: {},
          progressTrends: { durationTrend: [], caloriesTrend: [] }
        };
        state.error = action.payload;
      })
      
      // Fetch Recommendations Reducers
      .addCase(fetchWorkoutRecommendations.pending, (state) => {
        // Don't set loading status here to avoid interfering with analytics loading
        state.error = null;
      })
      .addCase(fetchWorkoutRecommendations.fulfilled, (state, action) => {
        const response = action.payload;
        
        if (response.status) {
          state.recommendations = {
            suggestedWorkoutTypes: response.suggestedWorkoutTypes || [],
            intensityAdjustment: response.intensityAdjustment || 'Keep up the good work!'
          };
        } else {
          state.recommendations = {
            suggestedWorkoutTypes: [],
            intensityAdjustment: 'Unable to generate recommendations at this time.'
          };
        }
        state.error = null;
      })
      .addCase(fetchWorkoutRecommendations.rejected, (state, action) => {
        state.recommendations = {
          suggestedWorkoutTypes: [],
          intensityAdjustment: 'Unable to generate recommendations at this time.'
        };
        state.error = action.payload;
      });
  }
});

export const { setSelectedPeriod, clearError, setActivePanel } = workoutSlice.actions;
export default workoutSlice.reducer;