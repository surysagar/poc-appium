import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Thunk to handle Test Suite submission
export const submitTestSuite = createAsyncThunk(
  'testSuite/submitTestSuite',
  async (testSuiteData, { rejectWithValue }) => {
    const accessToken = localStorage.getItem('access_token');
    const apiKey = localStorage.getItem('x-api-key');

    try {
      const response = await fetch('http://localhost:5000/api/v1/test-scripts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(testSuiteData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit test suite');
      }

      const data = await response.json();
      return data; // Return the response data
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state for the Test Suite slice
const initialState = {
  loading: false,
  success: false,
  error: null,
};

// Create slice
const testSuiteSlice = createSlice({
  name: 'testSuite',
  initialState,
  reducers: {
    resetStatus: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitTestSuite.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(submitTestSuite.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(submitTestSuite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetStatus } = testSuiteSlice.actions;

export default testSuiteSlice.reducer;
