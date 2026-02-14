import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  Certification,
  Education,
  Profile,
  WorkExperience,
} from '@prisma/client';

export type FullProfile = Profile & {
  workExperience: WorkExperience[];
  education: Education[];
  certifications: Certification[];
};

interface ProfileState {
  jobSeekerProfile: FullProfile | null;
  isLoading: boolean;
  error: string | null;
  isFetched: boolean;
}

const initialState: ProfileState = {
  jobSeekerProfile: null,
  isLoading: false,
  error: null,
  isFetched: false,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setProfile: (
      state,
      action: PayloadAction<{ profile: FullProfile | null }>,
    ) => {
      state.jobSeekerProfile = action.payload.profile;
      state.isLoading = false;
      state.error = null;
      state.isFetched = true;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
      state.isFetched = true;
    },

    clearProfile: (state) => {
      state.jobSeekerProfile = null;
      state.error = null;
      state.isFetched = false;
    },
  },
});

export const { setProfile, setLoading, setError, clearProfile } =
  profileSlice.actions;

export default profileSlice.reducer;
