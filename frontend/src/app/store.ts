// Configure Redux Toolkit store
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice'; // Create this next

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // I will add other reducers here later (e.g., events, bookings)
  },
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;