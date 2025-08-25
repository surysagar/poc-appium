import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk to handle POST request
export const fetchTestResults = createAsyncThunk(
  "testResults/fetchTestResults",
  async (body = null, { rejectWithValue }) => {
    const accessToken = localStorage.getItem("access_token");
    const apiKey = localStorage.getItem("x-api-key");

    try {
      const response = await fetch("http://localhost:5000/api/v1/test-run/list", {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json", // Ensure this for JSON body
        },
        body: body ? JSON.stringify(body) : null, // Add body only if provided
      });

      if (!response.ok) {
        throw new Error("Failed to fetch test results");
      }

      const data = await response.json(); // Assuming the response contains JSON data
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  data: [],
  loading: false,
  error: null,
};

// Create slice
const testResultsSlice = createSlice({
  name: "testResults",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTestResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTestResults.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchTestResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default testResultsSlice.reducer;
