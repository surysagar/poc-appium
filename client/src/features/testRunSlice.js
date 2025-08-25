// testRunSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Mock data for test runs, platforms, and devices
const initialState = {
  testRuns: ['regression SET 1', 'smoke Testing'],
  platforms: ['Android', 'iOS'],
  devices: ['Galaxy S22', 'Galaxy S21FE', 'iPhone 13', 'iPhone 15'] // List all devices here
};

export const testRunSlice = createSlice({
  name: 'testRun',
  initialState,
  reducers: {}
});

export const selectTestRuns = (state) => state.testRun.testRuns;
export const selectPlatforms = (state) => state.testRun.platforms;
export const selectDevices = (state) => state.testRun.devices;

export default testRunSlice.reducer;
