import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import workoutReducer from './slices/workoutSlice';
import progressReducer from './slices/progressSlice';
import billingReducer from './slices/billingSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  workout: workoutReducer,
  progress: progressReducer,
  billing: billingReducer,
});

export default rootReducer;
