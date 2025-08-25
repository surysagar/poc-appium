import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Thunk to fetch test suites from the API
export const fetchTestSuites = createAsyncThunk("testSuites/fetchTestSuites", async (_, { rejectWithValue }) => {
  const accessToken = localStorage.getItem("access_token");
  const apiKey = localStorage.getItem("x-api-key");

  try {
    const response = await fetch("http://localhost:5000/api/v1/test-scripts", {
      method: "GET",
      headers: {
        "x-api-key": apiKey,
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch test suites");
    }

    const data = await response.json();
    return data; // Return the array of test suites
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Thunk to delete a test suite from the API
export const deleteTestSuite = createAsyncThunk("testSuites/deleteTestSuite", async (suiteId, { rejectWithValue }) => {
  const accessToken = localStorage.getItem("access_token");
  const apiKey = localStorage.getItem("x-api-key");

  try {
    const response = await fetch(`http://localhost:5000/api/v1/test-scripts/${suiteId}`, {
      method: "DELETE",
      headers: {
        "x-api-key": apiKey,
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete test suite");
    }

    return suiteId; // Return the deleted suite's ID
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Initial state
const initialState = {
  data: [], // Holds the list of test suites
  suiteNames: [], // Holds the list of suite names
  loading: false, // Loading state for API call
  error: null, // Error message, if any
};

// Create slice
const testSuitesSlice = createSlice({
  name: "testSuites",
  initialState,
  reducers: {
    // Add custom reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTestSuites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTestSuites.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        // Map to an array of objects with name and script_id
        state.suiteNames = action.payload.map((suite) => ({
          name: suite.name || "Unnamed Suite", // Fallback to "Unnamed Suite" if name is not available
          script_id: suite._id,
        }));
      })
      .addCase(fetchTestSuites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteTestSuite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTestSuite.fulfilled, (state, action) => {
        state.loading = false;
        // Remove the deleted test suite from the state
        state.data = state.data.filter((suite) => suite._id !== action.payload);
        state.suiteNames = state.suiteNames.filter((suite) => suite.script_id !== action.payload);
      })
      .addCase(deleteTestSuite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default testSuitesSlice.reducer;
