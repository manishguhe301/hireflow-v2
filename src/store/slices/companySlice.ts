import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Company } from '@prisma/client';

interface CompanyState {
  company: Company | null;
  isLoading: boolean;
  error: string | null;
  isFetched: boolean;
}

const initialState: CompanyState = {
  company: null,
  isLoading: false,
  error: null,
  isFetched: false,
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
      }>,
    ) => {
      state.company = action.payload.company;
      state.isLoading = false;
      state.error = null;
      state.isFetched = true;
    },

    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    clearCompany: (state) => {
      state.company = null;
      state.error = null;
      state.isFetched = false;
    },
  },
});

export const { setLoading, setCompany, setError, clearCompany } =
  companySlice.actions;
export default companySlice.reducer;
