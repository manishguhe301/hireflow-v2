import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Company, CompanyStatus } from '@prisma/client';

interface CompanyState {
  company: Company | null;
  exists: boolean;
  isComplete: boolean;
  completionPercentage: number;
  missingFields: string[];
  isLoading: boolean;
  error: string | null;
}

const initialState: CompanyState = {
  company: null,
  exists: false,
  isComplete: false,
  completionPercentage: 0,
  missingFields: [],
  isLoading: false,
  error: null,
};

const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setCompany: (
      state,
      action: PayloadAction<{
        company: Company | null;
        exists: boolean;
        isComplete: boolean;
        completionPercentage: number;
        missingFields: string[];
      }>,
    ) => {
      state.company = action.payload.company;
      state.exists = action.payload.exists;
      state.isComplete = action.payload.isComplete;
      state.completionPercentage = action.payload.completionPercentage;
      state.missingFields = action.payload.missingFields;
      state.isLoading = false;
      state.error = null;
    },

    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    clearCompany: (state) => {
      state.company = null;
      state.exists = false;
      state.isComplete = false;
      state.completionPercentage = 0;
      state.missingFields = [];
      state.error = null;
    },
  },
});

export const { setLoading, setCompany, setError, clearCompany } =
  companySlice.actions;
export default companySlice.reducer;
