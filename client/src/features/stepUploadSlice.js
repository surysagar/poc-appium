import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Thunk to handle step definition file upload
export const uploadStepFile = createAsyncThunk(
  'upload/uploadStepFile',
  async (file, { rejectWithValue }) => {
    const accessToken = localStorage.getItem('access_token');
    const apiKey = localStorage.getItem('x-api-key');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/api/v1/document/upload', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload step file');
      }

      const data = await response.json();
      return data.data.id; // Return the uploaded file ID
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state for the step file upload slice
const initialState = {
  stepFileIds: [], // Store all uploaded file IDs here
  loading: false, // True if any file is uploading
  error: null,
};

// Create slice
const stepUploadSlice = createSlice({
  name: 'stepUpload',
  initialState,
  reducers: {
    reset: (state) => {
      state.stepFileIds = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadStepFile.pending, (state) => {
        state.loading = true; // Start loading when a file upload is in progress
        state.error = null;
      })
      .addCase(uploadStepFile.fulfilled, (state, action) => {
        console.log('Uploaded file ID:', action.payload);
        state.stepFileIds.push(action.payload); // Add the uploaded file ID to the array
        state.loading = false; // Loading is complete for the current file
      })
      .addCase(uploadStepFile.rejected, (state, action) => {
        state.loading = false; // Stop loading on failure
        state.error = action.payload; // Store the error message
      });
  },
});

export const { reset } = stepUploadSlice.actions;

export default stepUploadSlice.reducer;
