import React, { useState } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import { useAddData } from 'src/react-query/useFetchApis'; // Import the useAddData hook

const AddDevice = ({ onClose }) => {
  const [deviceData, setDeviceData] = useState({
    device_type: '',
    device_name: '',
    about_device: '',
    allocated_to: '',
    from_date: '',
    to_date: '',
    purpose: '',
  });

  const { isLoading, error, mutate } = useAddData('devices', '/devices/add/');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDeviceData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(deviceData, {
      onSuccess: () => {
        onClose(); // Close the dialog on successful submission
      },
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <TextField
        fullWidth
        label="Device Type"
        name="device_type"
        value={deviceData.device_type}
        onChange={handleChange}
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label="Device Name"
        name="device_name"
        value={deviceData.device_name}
        onChange={handleChange}
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label="About Device"
        name="about_device"
        value={deviceData.about_device}
        onChange={handleChange}
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label="Allocated To"
        name="allocated_to"
        value={deviceData.allocated_to}
        onChange={handleChange}
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label="From Date"
        name="from_date"
        type="date"
        value={deviceData.from_date}
        onChange={handleChange}
        margin="normal"
        InputLabelProps={{ shrink: true }}
        required
      />
      <TextField
        fullWidth
        label="To Date"
        name="to_date"
        type="date"
        value={deviceData.to_date}
        onChange={handleChange}
        margin="normal"
        InputLabelProps={{ shrink: true }}
        required
      />
      <TextField
        fullWidth
        label="Purpose"
        name="purpose"
        value={deviceData.purpose}
        onChange={handleChange}
        margin="normal"
        required
      />

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          Error: {error.message}
        </Typography>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Add Device'}
        </Button>
      </Box>
    </Box>
  );
};

// Add prop validation for onClose
AddDevice.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default AddDevice;
