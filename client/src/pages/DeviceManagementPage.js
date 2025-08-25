import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDeviceList,
  selectDeviceList,
  selectDeviceListStatus,
  selectDeviceListError,
  deleteDevice,
} from "./../features/deviceListSlice";
import Typography from "@mui/material/Typography";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CircleIcon from "@mui/icons-material/Circle";
import DeleteIcon from "@mui/icons-material/Delete";
import SyncIcon from "@mui/icons-material/Sync"; // Import Sync Icon
import EditDevice from "./EditDevice";
import DevicesIcon from "@mui/icons-material/Devices";
import { useTheme } from "@emotion/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DeviceManagementTable = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const devices = useSelector(selectDeviceList);
  const status = useSelector(selectDeviceListStatus);
  const error = useSelector(selectDeviceListError);

  const [open, setOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);

  const handleSyncClick = async () => {
    try {
      const accessToken = localStorage.getItem("access_token");
      const apiKey = localStorage.getItem("x-api-key");
      const response = await fetch("http://localhost:5000/api/v1/device/sync", {
        method: "GET",
        headers: {
          "x-api-key": apiKey,
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        dispatch(fetchDeviceList());
      }
    } catch (error) {
      console.error("Error syncing devices:", error);
    }
  };

  const handleDelete = (id) => {
    dispatch(deleteDevice(id)).then(() => {
      // Show toast notification on successful deletion
      toast.success("Device deleted successfully!", {
        position: "top-right", // Position on the right side
        autoClose: 3000, // Auto-hide after 3 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    });
  };

  useEffect(() => {
    dispatch(fetchDeviceList());
  }, [dispatch]);

  const handleEditClick = (device) => {
    setSelectedDevice(device);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedDevice(null);
    setTimeout(() => {
      toast.success("Device edited successfully!", {
        position: "top-right", // Position on the right side
        autoClose: 3000, // Auto-hide after 3 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }, 1000)
    
  };

  if (status === "loading") return <p>Loading...</p>;
  if (status === "failed") return <p>Error: {error}</p>;

  const mappedDevices = devices.map((device) => ({
    ...device,
    color: device.status === "Online" ? "green" : device.status === "Busy" ? "orange" : "red",
  }));

  return (
    <div>
      {/* Toast Notification Container */}
      <ToastContainer />

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
          padding: "0 3% 0 2%",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <DevicesIcon style={{ fontSize: "36px", marginRight: "10px", color: "#00008b" }} />
          <Typography variant="h4" style={{ color: "#213070", textAlign: "left" }}>
            Device Management
          </Typography>
        </div>

        <IconButton
          onClick={handleSyncClick}
          color="primary"
          style={{
            backgroundColor: theme.palette.primary.main,
            padding: "10px",
            height: "40px",
            width: "40px",
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <SyncIcon style={{ color: "white", fontSize: "24px" }} />
        </IconButton>
      </div>

      {/* Table */}
      <TableContainer component={Paper} style={{ width: "97%", margin: "auto auto", marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>DEVICE</strong>
              </TableCell>
              <TableCell>
                <strong>DEVICE TYPE</strong>
              </TableCell>
              <TableCell>
                <strong>DEVICE MODEL</strong>
              </TableCell>
              <TableCell>
                <strong>OS</strong>
              </TableCell>
              <TableCell>
                <strong>OS VERSION</strong>
              </TableCell>
              <TableCell>
                <strong>STATUS</strong>
              </TableCell>
              <TableCell>
                <strong>ACTIONS</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mappedDevices.map((device, index) => (
              <TableRow key={index}>
                <TableCell>{device.device_id}</TableCell>
                <TableCell>{device.device_type}</TableCell>
                <TableCell>{device.device_model}</TableCell>
                <TableCell>{device?.os}</TableCell>
                <TableCell>{device?.os_version}</TableCell>
                <TableCell>
                  <CircleIcon style={{ color: device.color, marginRight: "8px" }} />
                  {device.status}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditClick(device)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(device._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {selectedDevice && <EditDevice open={open} handleClose={handleClose} device={selectedDevice} />}
    </div>
  );
};

export default DeviceManagementTable;
