import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Thunk to fetch test suites
export const fetchTestSuites = createAsyncThunk(
  'testSuitesData/fetchTestSuites',
  async (_, { rejectWithValue }) => {
    const accessToken = localStorage.getItem('access_token');
    const apiKey = localStorage.getItem('x-api-key');

    try {
      const response = await fetch('http://localhost:5000/api/v1/test-scripts', {
        method: 'GET',
        headers: {
          'x-api-key': apiKey,
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch test suites');
      }

      const data = await response.json();
      console.log(data);
      return data; // Assuming the response is an array of test suites
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state for the testSuites slice
const initialState = {
  testSuitesData: [],
  loading: false,
  error: null,
};

// Create slice
const testSuitesDataSlice = createSlice({
  name: 'testSuitesData',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTestSuites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTestSuites.fulfilled, (state, action) => {
        state.loading = false;
        state.testSuitesData = action.payload;
      })
      .addCase(fetchTestSuites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default testSuitesDataSlice.reducer;
