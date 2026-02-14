import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import companyReducer from './slices/companySlice';
import userProfile from './slices/job-seeker/userProfileSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    company: companyReducer,
    jobSeekerProfile: userProfile,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
