import React, { useState } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import { useUpdateData } from 'src/react-query/useFetchApis'; // Use useUpdateData instead of useEditData

const EditDevice = ({ device, onClose }) => {
  // Initialize state with default values
  const [deviceData, setDeviceData] = useState({
    device_type: device?.device_type || '',
    device_name: device?.device_name || '',
    about_device: device?.about_device || '',
    allocated_to: device?.allocated_to || '',
    from_date: device?.from_date || '',
    to_date: device?.to_date || '',
    purpose: device?.purpose || '',
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false); // State to control the snackbar visibility
  const [snackbarMessage, setSnackbarMessage] = useState(''); // State to store the snackbar message

  // Use the useUpdateData hook for the update API call
  const { isLoading, error, mutate } = useUpdateData(
    'devices',
    device ? `/devices/update/${device.id}/` : null, // Only set the URL if device is defined
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDeviceData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Ensure device is defined before proceeding
    if (!device) {
      setSnackbarMessage('No device data available.'); // Set the error message
      setSnackbarOpen(true); // Show the snackbar
      return;
    }

    // Create a payload with all fields, but only update the ones that have been changed
    const payload = { ...deviceData };

    // Log the payload for debugging
    console.log('Payload being sent:', payload);

    // Call the mutate function with the payload
    mutate(payload, {
      onSuccess: () => {
        setSnackbarMessage('Device updated successfully'); // Set the success message
        setSnackbarOpen(true); // Show the snackbar
        onClose(); // Close the dialog on successful submission
      },
      onError: (error) => {
        console.error('Error updating device:', error);
        setSnackbarMessage('Failed to update device'); // Set the error message
        setSnackbarOpen(true); // Show the snackbar
      },
    });
  };

  // Function to close the snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // If device is null, show a message instead of rendering the form
  if (!device) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Typography color="error">No device data available.</Typography>
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <TextField
        fullWidth
        label="Device Type"
        name="device_type"
        value={deviceData.device_type}
        onChange={handleChange}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Device Name"
        name="device_name"
        value={deviceData.device_name}
        onChange={handleChange}
        margin="normal"
      />
      <TextField
        fullWidth
        label="About Device"
        name="about_device"
        value={deviceData.about_device}
        onChange={handleChange}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Allocated To"
        name="allocated_to"
        value={deviceData.allocated_to}
        onChange={handleChange}
        margin="normal"
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
      />
      <TextField
        fullWidth
        label="Purpose"
        name="purpose"
        value={deviceData.purpose}
        onChange={handleChange}
        margin="normal"
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
          {isLoading ? <CircularProgress size={24} /> : 'Update Device'}
        </Button>
      </Box>

      {/* Snackbar for success/error messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </Box>
  );
};

// Add prop validation
EditDevice.propTypes = {
  device: PropTypes.shape({
    id: PropTypes.number.isRequired,
    device_type: PropTypes.string,
    device_name: PropTypes.string,
    about_device: PropTypes.string,
    allocated_to: PropTypes.string,
    from_date: PropTypes.string,
    to_date: PropTypes.string,
    purpose: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
};

EditDevice.defaultProps = {
  device: null, // Set default value for device
};

export default EditDevice;
