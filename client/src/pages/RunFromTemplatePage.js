import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTestSuites } from "../features/testSuitesSlice";
import { fetchDeviceList } from "../features/deviceListSlice";
import { useNavigate } from "react-router-dom";

import Typography from "@mui/material/Typography";
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Paper } from "@mui/material";
import { VscRunAll } from "react-icons/vsc";
import { submitTestRun } from "../features/runTestSuiteSlice";

const RunFromTemplate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { platformWithDevices, deviceOptionsKeys } = useSelector((state) => state.deviceList);
  const { suiteNames } = useSelector((state) => state.testSuites);

  const [selectedTestRun, setSelectedTestRun] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [selectedDevices, setSelectedDevices] = useState("");
  const [bundleId, setBundleId] = useState("");
  const [xcodeOrgId, setxcodeOrgId] = useState("");
  const [appActivity, setAppActivity] = useState("");
  const [appPackage, setAppPackage] = useState("");

  useEffect(() => {
    dispatch(fetchTestSuites());
    dispatch(fetchDeviceList("Online"));
  }, [dispatch]);

  const handlePlatformChange = (event) => {
    const selected = event.target.value;
    setSelectedPlatform(selected);
    setSelectedDevices("");
    setBundleId("");
    setxcodeOrgId("");
    setAppActivity("");
    setAppPackage("");
  };

  const handleSubmit = async () => {
    const formData = {
      script_id: selectedTestRun,
      device_id: selectedDevices,
      capabilities: selectedPlatform === "iOS" ? { bundleId, xcodeOrgId } : { appActivity, appPackage },
    };

    try {
      const result = await dispatch(submitTestRun(formData)).unwrap();
      navigate("/test-results");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <React.StrictMode>
      <Box>
        <div style={{ display: "flex", alignItems: "center", marginLeft: "30px" }}>
          <VscRunAll style={{ fontSize: "36px", marginRight: "10px", color: "#00008b" }} />
          <Typography variant="h4" style={{ color: "#213070", textAlign: "left" }}>
            Run Test Suite
          </Typography>
        </div>
        <Paper
          elevation={3}
          sx={{
            padding: "40px 20px", // More padding on top/bottom than left/right
            maxWidth: "600px",
            margin: "0 auto",
            borderRadius: "16px", // Rounded corners
            backgroundColor: "#ffffff",
          }}
        >
          <Box sx={{ marginBottom: "20px" }}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="test-run-label">Select Test Suite</InputLabel>
              <Select
                labelId="test-run-label"
                value={selectedTestRun}
                onChange={(e) => setSelectedTestRun(e.target.value)}
                label="Select Test Run"
              >
                {suiteNames.map((run, index) => (
                  <MenuItem key={index} value={run.script_id}>
                    {run.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ marginBottom: "20px" }}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="platform-label">Select Platform</InputLabel>
              <Select
                labelId="platform-label"
                value={selectedPlatform}
                onChange={handlePlatformChange}
                label="Select Platform"
              >
                {deviceOptionsKeys.map((platform, index) => (
                  <MenuItem key={index} value={platform}>
                    {platform}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ marginBottom: "20px" }}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="device-label">Select Device</InputLabel>
              <Select
                labelId="device-label"
                value={selectedDevices || ""}
                onChange={(e) => setSelectedDevices(e.target.value)}
                label="Select Device"
              >
                {(platformWithDevices[selectedPlatform] || []).map((device, index) => (
                  <MenuItem key={index} value={device.device_id}>
                    {device.device_model ? `${device.device_model} (${device.device_id})` : device.device_id}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {selectedPlatform === "iOS" && (
            <>
              <Box sx={{ marginBottom: "10px" }}>
                <TextField fullWidth label="Bundle ID" value={bundleId} onChange={(e) => setBundleId(e.target.value)} />
              </Box>
              <Box sx={{ marginBottom: "10px" }}>
                <TextField
                  fullWidth
                  label="X code Org Id (*Mandatory for physical device only)"
                  value={xcodeOrgId}
                  onChange={(e) => setxcodeOrgId(e.target.value)}
                />
              </Box>
            </>
          )}

          {selectedPlatform === "Android" && (
            <>
              <Box sx={{ marginBottom: "10px" }}>
                <TextField
                  fullWidth
                  label="App Activity"
                  value={appActivity}
                  onChange={(e) => setAppActivity(e.target.value)}
                />
              </Box>
              <Box sx={{ marginBottom: "10px" }}>
                <TextField
                  fullWidth
                  label="App Package"
                  value={appPackage}
                  onChange={(e) => setAppPackage(e.target.value)}
                />
              </Box>
            </>
          )}

          <Box sx={{ textAlign: "center" }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleSubmit}
              sx={{
                marginTop: "12px",
                padding: "10px 14px", // Adds vertical padding for a taller button
                fontSize: "16px", // Optional: Adjust text size if needed
              }}
            >
              Run Test
            </Button>
          </Box>
        </Paper>
      </Box>
    </React.StrictMode>
  );
};

export default RunFromTemplate;
