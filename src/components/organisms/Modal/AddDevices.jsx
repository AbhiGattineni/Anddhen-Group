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

  // Define the fields to be rendered
  const fields = [
    {
      name: 'device_type',
      label: 'Device Type',
      type: 'text',
      required: true,
    },
    {
      name: 'device_name',
      label: 'Device Name',
      type: 'text',
      required: true,
    },
    {
      name: 'about_device',
      label: 'About Device',
      type: 'text',
      required: true,
    },
    {
      name: 'allocated_to',
      label: 'Allocated To',
      type: 'text',
      required: true,
    },
    {
      name: 'from_date',
      label: 'From Date',
      type: 'date',
      required: true,
    },
    {
      name: 'to_date',
      label: 'To Date',
      type: 'date',
      required: true,
    },
    {
      name: 'purpose',
      label: 'Purpose',
      type: 'text',
      required: true,
    },
  ];

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      {/* Map over the fields array to render TextField components */}
      {fields.map((field) => (
        <TextField
          key={field.name}
          fullWidth
          label={field.label}
          name={field.name}
          type={field.type}
          value={deviceData[field.name]}
          onChange={handleChange}
          margin="normal"
          required={field.required}
          InputLabelProps={field.type === 'date' ? { shrink: true } : undefined}
        />
      ))}

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
