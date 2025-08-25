import { configureStore } from '@reduxjs/toolkit';
import testResultsReducer from './features/testResultSlice';
import testRunReducer from './features/testRunSlice';
import deviceListReducer from './features/deviceListSlice';
import featureUploadReducer from './features/featureUploadSlice';
import stepUploadReducer from './features/stepUploadSlice';
import testSuiteReducer from './features/testSuiteUploadSlice';
import testSuiteDataReducer from './features/testSuiteDataSlice';
import testSuitesReducer from './features/testSuitesSlice';
import dashboardReducer from './features/dashboardSlice';

export const store = configureStore({
  reducer: {
    testResults: testResultsReducer,
    testRun: testRunReducer,
    deviceList: deviceListReducer,
    featureUpload: featureUploadReducer,
    stepUpload: stepUploadReducer,
    testSuite: testSuiteReducer,
    testSuiteData: testSuiteDataReducer,
    testSuites: testSuitesReducer,
    dashboard: dashboardReducer
  },
});
