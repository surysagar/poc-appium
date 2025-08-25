import React, { useState } from 'react';
import { Box, Modal, TextField, Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import { updateDevice } from '../features/deviceListSlice';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const EditDevice = ({ open, handleClose, device }) => {
  const [formData, setFormData] = useState({
    device_type: device?.device_type,
    device_model: device.device_model,
    os_version: device?.os_version,
  });

  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    dispatch(updateDevice({ id: device.device_id, ...formData }));
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle}>
        <h2>Edit Device</h2>
        <TextField
          label="Device Type"
          name="device_type"
          value={formData?.device_type}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Device Model"
          name="device_model"
          value={formData.device_model}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="OS Version"
          name="os_version"
          value={formData.os_version}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
          <Button variant="outlined" color="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Update
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditDevice;
