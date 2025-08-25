// src/components/TestSuiteMgmt.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  Grid,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { uploadStepFile } from "../features/stepUploadSlice";
import { uploadFeatureFile } from "../features/featureUploadSlice";
import { submitTestSuite, resetStatus } from "../features/testSuiteUploadSlice";
import { reset as resetStepUpload } from "../features/stepUploadSlice";
import { reset as resetFeatureUpload } from "../features/featureUploadSlice";


const TestSuiteMgmt = ({ onAddTestSuite, open, setOpen }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    testType: "",
    featureFile: null,
    stepFiles: [], // Change stepFile to stepFiles as an array
  });
  

  const dispatch = useDispatch();
  const { featureFileId, loading: featureLoading, error: featureError } = useSelector((state) => state.featureUpload);
  const { stepFileIds, loading: stepLoading, error: stepError } = useSelector((state) => state.stepUpload);

  useEffect(() => {
    if (!open) {
      dispatch(resetStepUpload());
      dispatch(resetFeatureUpload());
    }
  }, [open, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
  
    if (name === "featureFile") {
      const selectedFile = files[0];
      setFormData((prevData) => ({
        ...prevData,
        [name]: selectedFile,
      }));
      if (selectedFile) dispatch(uploadFeatureFile(selectedFile));
    }
  
    if (name === "stepFiles") {
      const fileArray = Array.from(files); // Convert FileList to an array
      setFormData((prevData) => ({
        ...prevData,
        stepFiles: [...prevData.stepFiles, ...fileArray],
      }));
  
      fileArray.forEach((file) => {
        dispatch(uploadStepFile(file)); // Dispatch file upload for each file
      });
    }
  };
  
  

  useEffect(() => {
    // Reset form data when the modal is opened
    if (open) {
      setFormData({
        name: "",
        description: "",
        testType: "",
        featureFile: null,
        stepFile: null,
      });
    }
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await dispatch(
        submitTestSuite({
          name: formData.name,
          description: formData.description,
          test_type: formData.testType,
          script_id: featureFileId,
          step_file_ids: stepFileIds, // Use IDs from Redux state
        })
      ).unwrap();
  
      onAddTestSuite();
      setFormData({
        name: "",
        description: "",
        testType: "",
        featureFile: null,
        stepFiles: [],
      });

       
      dispatch(resetStatus());
      dispatch({ type: "featureUpload/reset" });
      dispatch({ type: "stepUpload/reset" });
  
      setOpen(false);
    } catch (error) {
      console.error("Error submitting test suite:", error);
    }
  };
  
  

  return (
    
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: "400px", margin: "auto" }}>
      <Grid container spacing={2}>
        {/* Name Field */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" sx={{ color: "#333", textAlign: "left", mb: 0.5 }}>
            Name
          </Typography>
          <TextField
            fullWidth
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            inputProps={{ style: { textAlign: "left" } }}
          />
        </Grid>
  
        {/* Description Field */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" sx={{ color: "#333", textAlign: "left", mb: 0.5 }}>
            Description
          </Typography>
          <TextField
            fullWidth
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            inputProps={{ style: { textAlign: "left" } }}
          />
        </Grid>
  
        {/* Test Type Field */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" sx={{ color: "#333", textAlign: "left", mb: 0.5 }}>
            Test Type
          </Typography>
          <FormControl fullWidth>
            <Select
              name="testType"
              value={formData.testType}
              onChange={handleChange}
              required
              displayEmpty
              sx={{
                textAlign: "left",
                ".MuiSelect-select": { textAlign: "left" },
              }}
              MenuProps={{
                PaperProps: {
                  sx: { textAlign: "left" },
                },
              }}
            >
              <MenuItem value="" disabled>
                Select Test Type
              </MenuItem>
              <MenuItem value="Cucumber">Cucumber</MenuItem>
            </Select>
          </FormControl>
        </Grid>
  
        {/* Feature File Upload */}
        {formData.testType && (
          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ color: "#333", textAlign: "left", mb: 0.5 }}>
              Feature File
            </Typography>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{
                height: "50px",
                justifyContent: "flex-start",
                textTransform: "none",
                gap: "10px",
              }}
            >
              <CloudUploadIcon />
              {formData.featureFile ? formData.featureFile.name : "Upload Feature File"}
              <input type="file" name="featureFile" onChange={handleFileChange} hidden />
            </Button>
            {featureLoading && <CircularProgress size={24} sx={{ marginTop: "10px" }} />}
            {featureError && (
              <div style={{ color: "red", marginTop: "10px" }}>Error uploading feature file: {featureError}</div>
            )}
          </Grid>
        )}
  
        {/* Step Definitions File Upload */}
        {featureFileId && (
          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ color: "#333", textAlign: "left", mb: 0.5 }}>
              Step Files
            </Typography>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{
                height: "50px",
                justifyContent: "flex-start",
                textTransform: "none",
                gap: "10px",
              }}
            >
              <CloudUploadIcon />
              {"Upload Step Files"}
              <input type="file" name="stepFiles" onChange={handleFileChange} multiple hidden />
            </Button>
            <ul style={{ marginTop: "10px" }}>
              {formData.stepFiles.map((file, index) => (
                <li key={index}>
                  {file.name}{" "}
                  {stepLoading ? (
                    <CircularProgress size={16} />
                  ) : stepError ? (
                    <span style={{ color: "red" }}>Error</span>
                  ) : (
                    <span style={{ color: "green" }}>Uploaded</span>
                  )}
                </li>
              ))}
            </ul>
            {stepError && <div style={{ color: "red", marginTop: "10px" }}>Error uploading step files: {stepError}</div>}
          </Grid>
        )}
  
        {/* Submit Button */}
        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={featureLoading || stepLoading}
            sx={{
              marginTop: "12px",
              padding: "10px 10px",
              fontSize: "16px",
            }}
          >
            {featureLoading || stepLoading ? <CircularProgress size={24} /> : "Submit"}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
  };

export default TestSuiteMgmt;
