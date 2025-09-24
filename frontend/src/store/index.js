// import rootReducer from './rootReducer';
// import { configureStore } from '@reduxjs/toolkit';

// const middlewares = [];

// const store = configureStore({
// 	reducer: rootReducer(),
// 	middleware: (getDefaultMiddleware) =>
// 		getDefaultMiddleware({
// 			immutableCheck: false,
// 			serializableCheck: false,
// 		}).concat(middlewares),
// 	// devTools: process.env.NODE_ENV === 'development',
// })

// store.asyncReducers = {};

// export const injectReducer = (key, reducer) => {
// 	console.log(store.asyncReducers[key], "key");

// 	if (store.asyncReducers[key]) {
// 		return false;
// 	}
// 	store.asyncReducers[key] = reducer;
// 	store.replaceReducer(rootReducer(store.asyncReducers));
// 	return store
// }

// export default store

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import workoutReducer from "./slices/workoutSlice";
import progressReducer from "./slices/progressSlice";
import billingReducer from "./slices/billingSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    workout: workoutReducer,
    progress: progressReducer,
    billing: billingReducer,
  },
  
});

export default store;
