import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Thunk to submit test run
export const submitTestRun = createAsyncThunk(
  "runTestSuite/submitTestRun",
  async (formData, { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem("access_token");
      const apiKey = localStorage.getItem("x-api-key");

      const response = await fetch("http://localhost:5000/api/v1/test-run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit test run");
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const runTestSuiteSlice = createSlice({
  name: "runTestSuite",
  initialState: {
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(submitTestRun.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitTestRun.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(submitTestRun.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default runTestSuiteSlice.reducer;
