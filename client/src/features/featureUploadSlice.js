// src/slices/featureUploadSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Thunk to handle feature file upload
export const uploadFeatureFile = createAsyncThunk(
  'upload/uploadFeatureFile',
  async (file, { rejectWithValue }) => {
    const accessToken = localStorage.getItem('access_token');
    const apiKey = localStorage.getItem('x-api-key');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/api/v1/document/upload', {
        method: 'POST', // Ensure the method is POST
        headers: {
          'x-api-key': apiKey,
          'Authorization': `Bearer ${accessToken}`,
          // Do not set 'Content-Type', FormData will automatically set it
        },
        body: formData, // The FormData with the file content
      });

      if (!response.ok) {
        throw new Error('Failed to upload feature file');
      }

      const data = await response.json();
    //   console.log(data);
      return data?.data.id; // The API returns an ID string
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state for the feature file upload slice
const initialState = {
  featureFileId: null,
  loading: false,
  error: null,
};

// Create slice
const featureUploadSlice = createSlice({
  name: 'featureUpload',
  initialState,
  reducers: {
    reset: (state) => {
      state.featureFileId = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadFeatureFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadFeatureFile.fulfilled, (state, action) => {
        state.featureFileId = action.payload;
        state.loading = false;
      })
      .addCase(reset, (state) => {
        state.featureFileId = null;
      },)
      .addCase(uploadFeatureFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { reset } = featureUploadSlice.actions;

export default featureUploadSlice.reducer;  
