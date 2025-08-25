import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import HomePage from './pages/HomePage';
import TestResultPage from './pages/TestResultPage';
import DeviceManagementPage from './pages/DeviceManagementPage';
import TestRunManagementPage from './pages/TestRunManagementPage';
import RunFromTemplatePage from './pages/RunFromTemplatePage';
import CreateRegularTestRun from './pages/CreateRegularTestRun';
import CreateCustomTestRun from './pages/CreateCustomTestRun';
import TestCaseManagement from './pages/TestCaseManagementPage';
import Dashboard from './pages/dashboard';
import LoginPage from './pages/LoginPage';
import { AuthProvider, AuthContext } from './AuthContext';
import TestSuiteMgmt from './pages/TestSuiteMgmt';
import TestSuiteTable from './pages/TestSuiteTable';
import theme from './theme'; // Path to your theme file

function AppRoutes() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />}
      />
      <Route
        path="/"
        element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />}
      >
        <Route index element={<Dashboard />} />
        <Route path="test-run-management" element={<TestRunManagementPage />} />
        <Route path="test-suite" element={<TestSuiteTable />} />
        <Route path="test-results" element={<TestResultPage />} />
        <Route path="test-case-management" element={<TestCaseManagement />} />
        <Route path="device-management" element={<DeviceManagementPage />} />
        <Route path="run-from-template" element={<RunFromTemplatePage />} />
        <Route path="create-regular-test-run" element={<CreateRegularTestRun />} />
        <Route path="create-custom-test-run" element={<CreateCustomTestRun />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
      <Router>
        <AppRoutes />
      </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
