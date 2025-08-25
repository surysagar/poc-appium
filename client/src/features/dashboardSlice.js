import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Base URL for APIs
const baseUrl = 'http://localhost:5000'; // Replace with your actual base_url

// Async thunk for fetching summary
export const fetchSummary = createAsyncThunk(
  'dashboard/fetchSummary',
  async (_, { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem("access_token");
      const apiKey = localStorage.getItem("x-api-key");
      const response = await fetch(`${baseUrl}/api/v1/dashboard/summary`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            Authorization: `Bearer ${accessToken}`,
          }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch summary');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for fetching weekly summary
export const fetchWeeklySummary = createAsyncThunk(
  'dashboard/fetchWeeklySummary',
  async (_, { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem("access_token");
      const apiKey = localStorage.getItem("x-api-key");
      const response = await fetch(`${baseUrl}/api/v1/dashboard/weeklysummary`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            Authorization: `Bearer ${accessToken}`,
          }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch weekly summary');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  summary: null,
  weeklySummary: null,
  loading: false,
  error: null,
};

// Create slice
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle summary fetch
      .addCase(fetchSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSummary.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action.payload);
        state.summary = action.payload;
      })
      .addCase(fetchSummary.rejected, (state, action) => {
        state.loading = false;
        
        state.error = action.payload;
      })
      // Handle weekly summary fetch
      .addCase(fetchWeeklySummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeeklySummary.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action.payload);
        state.weeklySummary = action.payload;
      })
      .addCase(fetchWeeklySummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default dashboardSlice.reducer;
