import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { fetchTestSuites, deleteTestSuite } from "../features/testSuitesSlice";
import TestSuiteMgmt from "./TestSuiteMgmt";
import { BsFileEarmarkText } from "react-icons/bs";
import SettingsIcon from "@mui/icons-material/Settings"; // Gear icon for settings/configuration
import DeleteIcon from "@mui/icons-material/Delete";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TestSuiteTable = () => {
  const dispatch = useDispatch();
  const { data: testSuites, loading, error } = useSelector((state) => state.testSuites);

  const [addDialogOpen, setAddDialogOpen] = useState(false); // Separate state for Add dialog

  useEffect(() => {
    dispatch(fetchTestSuites());
  }, [dispatch]);

  const handleOpenAddDialog = () => setAddDialogOpen(true);
  const handleCloseAddDialog = () => setAddDialogOpen(false);

  const handleAddTestSuiteSuccess = () => {
    handleCloseAddDialog(); // Close the Add dialog

    toast.success("Test Suite created successfully!", {
      position: "top-right", // Position on the right side
      autoClose: 3000, // Auto-hide after 3 seconds
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });

    setTimeout(() => {
      dispatch(fetchTestSuites()); // Refresh table data after 1 second
    }, 1000);
  };

  const handleDelete = (id) => {
    dispatch(deleteTestSuite(id)); // Example placeholder
    setTimeout(() => {
      toast.success("Test Suite deleted successfully!", {
        position: "top-right", // Position on the right side
        autoClose: 3000, // Auto-hide after 3 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    })
  };

  return (
    <>
      <div>
      <ToastContainer />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px",
            padding: "0 2%",
          }}
        >
          {/* Left-aligned Header */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <BsFileEarmarkText style={{ fontSize: "36px", marginRight: "10px", color: "#00008b" }} />
            <Typography variant="h4" sx={{ color: "#213070", textAlign: "left" }}>
              Test Suites
            </Typography>
          </div>

          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenAddDialog}
            startIcon={<SettingsIcon style={{ color: "white" }} />}
            sx={{
              marginTop: "12px",
              padding: "10px 14px", // Adds vertical padding for a taller button
              fontSize: "16px", // Adjust text size if needed
            }}
          >
            Add Test Suite
          </Button>
        </div>

        <TableContainer component={Paper} sx={{ width: "97%", margin: "auto auto" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "20px" }}>
              <CircularProgress />
            </div>
          ) : error ? (
            <div style={{ textAlign: "center", padding: "20px", color: "red" }}>Error: {error}</div>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ textAlign: "center" }}>
                    <strong>Name</strong>
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    <strong>Description</strong>
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    <strong>Test Type</strong>
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    <strong>Script File</strong>
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    <strong>Definition Files</strong>
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    <strong>Actions</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {testSuites.length > 0 ? (
                  testSuites.map((suite, index) => (
                    <TableRow key={index}>
                      <TableCell style={{ textAlign: "center" }}>{suite.name}</TableCell>
                      <TableCell style={{ textAlign: "center" }}>{suite.description}</TableCell>
                      <TableCell style={{ textAlign: "center" }}>{suite.test_type}</TableCell>
                      <TableCell style={{ textAlign: "center" }}>{suite.script_details?.[0]?.name || "N/A"}</TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        {suite.step_file_details?.length
                          ? suite.step_file_details.map((file) => file.name).join(", ")
                          : "N/A"}
                      </TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        <IconButton onClick={() => handleDelete(suite._id)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} style={{ textAlign: "center" }}>
                      No Test Suites Available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      </div>

      {/* Add Test Suite Dialog */}
      <Dialog open={addDialogOpen} onClose={handleCloseAddDialog} fullWidth maxWidth="sm">
        <DialogTitle>
          Add New Test Suite
          <IconButton
            aria-label="close"
            onClick={handleCloseAddDialog}
            style={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TestSuiteMgmt onAddTestSuite={handleAddTestSuiteSuccess} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TestSuiteTable;
