import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTestResults } from "../features/testResultSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TablePagination,
  IconButton,
  Popover,
  List,
  ListItem,
} from "@mui/material";
import { BsGraphUp } from "react-icons/bs";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ListAltIcon from "@mui/icons-material/ListAlt";

const TestResultsTable = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.testResults);

  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(10);
  const [popoverInfo, setPopoverInfo] = useState({ anchorEl: null, rowId: null });

  useEffect(() => {
    dispatch(fetchTestResults({ skip, limit }));
  }, [dispatch, skip, limit]);

  const handleChangePage = (event, newPage) => {
    setSkip(newPage * limit);
  };

  const handleChangeRowsPerPage = (event) => {
    setLimit(parseInt(event.target.value, 10));
    setSkip(0);
  };

  const handlePopoverOpen = (event, rowId) => {
    setPopoverInfo({ anchorEl: event.currentTarget, rowId });
  };

  const handlePopoverClose = () => {
    setPopoverInfo({ anchorEl: null, rowId: null });
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error: {error}</Typography>;

  const result = data?.result || [];
  const totalCount = data?.totalCount || 0;

  return (
    <React.StrictMode>
      <div style={{ display: "flex", alignItems: "center", marginLeft: "30px" }}>
        <BsGraphUp style={{ fontSize: "36px", marginRight: "10px", color: "#00008b" }} />
        <Typography variant="h4" style={{ color: "#213070", textAlign: "left" }}>
          Test Results
        </Typography>
      </div>
      <TableContainer component={Paper} style={{ width: "97%", margin: "auto", marginTop: "20px" }}>
        <Table aria-label="test results table">
          <TableHead>
            <TableRow>
              <TableCell align="center">
                <strong>Device</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Model</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Date</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Device Type</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Script</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Status</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Executed By</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Report</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Logs</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {result.map((row) => (
              <TableRow key={row._id}>
                <TableCell align="center">
                  {row.device_id}
                  {row.device_details?.os && ` (${row.device_details.os})`}
                </TableCell>
                <TableCell align="center">{row.device_details?.device_model}</TableCell>
                <TableCell align="center">
                  {new Date(row.createdAt).toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric",
                    hour12: true,
                  })}
                </TableCell>
                <TableCell align="center">{row.device_details?.device_type ?? ""}</TableCell>
                <TableCell align="center">{row.script_name}</TableCell>
                <TableCell align="center">
                  {row.status === "Success" || row.status === "passing" ? (
                    <span style={{ color: "green" }}>● {row.status}</span>
                  ) : row.status === "Failed" ? (
                    <span style={{ color: "red" }}>● {row.status}</span>
                  ) : (
                    <span style={{ color: "orange" }}>● {row.status}</span>
                  )}
                </TableCell>
                <TableCell align="center">
                  {`${row.executed_by_details?.first_name || ""} ${row.executed_by_details?.last_name || ""}`}
                </TableCell>
                <TableCell align="center">
                  {row.status === "Success" ? (
                    <a
                      href={`http://localhost:5000/api/v1/test-run/report/${row._id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <OpenInNewIcon style={{ color: "#007BFF" }} />
                    </a>
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  )}
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    onMouseOver={(event) => {
                      console.log("opening");
                      handlePopoverOpen(event, row._id);
                    }}
                  >
                    <ListAltIcon style={{ color: "#007BFF" }} />
                  </IconButton>
                  <Popover
                    open={Boolean(popoverInfo.anchorEl) && popoverInfo.rowId === row._id}
                    anchorEl={popoverInfo.anchorEl}
                    onClose={handlePopoverClose}
                    anchorOrigin={{
                      vertical: "center",
                      horizontal: "right",
                    }}
                    transformOrigin={{
                      vertical: "center",
                      horizontal: "left",
                    }}
                    PaperProps={{
                      onMouseLeave: handlePopoverClose, // Close when the mouse leaves the Popover
                    }}
                  >
                    <List style={{ width: "200px" }}>
                      <ListItem button>
                        <a
                          href={`http://localhost:5000/api/v1/test-run/logs/${popoverInfo.rowId}?type=appium`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View appium logs
                        </a>
                      </ListItem>
                      <ListItem button>
                        <a
                          href={`http://localhost:5000/api/v1/test-run/logs/${popoverInfo.rowId}?type=wdio`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View wdio logs
                        </a>
                      </ListItem>
                    </List>
                  </Popover>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalCount}
          rowsPerPage={limit}
          page={skip / limit}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </React.StrictMode>
  );
};

export default TestResultsTable;
