import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { useDispatch } from "react-redux";

export const fetchDeviceList = createAsyncThunk("deviceList/fetchDeviceList", async (status = "all") => {
  const accessToken = localStorage.getItem("access_token");
  const apiKey = localStorage.getItem("x-api-key");

  const response = await axios.get(`http://localhost:5000/api/v1/device/all?status=${status}`, {
    headers: {
      "x-api-key": apiKey,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
});

export const updateDevice = createAsyncThunk(
  "devices/updateDevice",
  async ({ id, device_type, device_model, os_version }, { dispatch }) => {
    const accessToken = localStorage.getItem("access_token");
    const apiKey = localStorage.getItem("x-api-key");

    const response = await axios.put(
      `http://localhost:5000/api/v1/device/${id}`,
      { device_type, device_model, os_version },
      {
        headers: {
          "x-api-key": apiKey,
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Refetch the device list after updating
    dispatch(fetchDeviceList());
    return response.data;
  }
);

const deviceListSlice = createSlice({
  name: "deviceList",
  initialState: {
    devices: [],
    platformWithDevices: {},
    deviceOptionsKeys: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDeviceList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDeviceList.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.devices = action.payload;
        // Group devices by platform
        const platformWithDevices = action.payload.reduce((acc, device) => {
          const { os, device_id, device_model } = device;

          // Use "Unknown" for missing device_os
          const key = os || "Unknown";
          if (device_id) {
            if (!acc[key]) {
              acc[key] = [];
            }
            acc[key].push({ device_id, device_model });
          } else {
            console.warn("Skipping device due to missing device_id:", device);
          }
          return acc;
        }, {});

        state.platformWithDevices = platformWithDevices;
        console.log(Object.keys(platformWithDevices));
        state.deviceOptionsKeys = Object.keys(platformWithDevices);
      })
      .addCase(fetchDeviceList.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateDevice.fulfilled, (state, action) => {
        const updatedDevice = action.payload;
        const index = state.devices.findIndex((device) => device.device_id === updatedDevice.device_id);
        if (index !== -1) {
          state.devices[index] = updatedDevice; // Update the specific device
        }
      });
  },
});

export const deleteDevice = createAsyncThunk("devices/deleteDevice", async (id, { dispatch }) => {
  const accessToken = localStorage.getItem("access_token");
  const apiKey = localStorage.getItem("x-api-key");

  await axios.delete(`http://localhost:5000/api/v1/device/${id}`, {
    headers: {
      "x-api-key": apiKey,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  // Refetch the device list after deleting
  dispatch(fetchDeviceList());
  return id;
});

export const selectDeviceList = (state) => state.deviceList.devices;
export const selectDeviceListStatus = (state) => state.deviceList.status;
export const selectDeviceListError = (state) => state.deviceList.error;

export default deviceListSlice.reducer;
