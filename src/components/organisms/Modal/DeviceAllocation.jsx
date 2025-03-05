import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Button,
  DialogContentText,
  DialogActions,
  Snackbar,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete'; // Import the delete icon
import EditIcon from '@mui/icons-material/Edit'; // Import the edit icon
import { useFetchData } from 'src/react-query/useFetchApis'; // Import the useFetchData hook
import { useDeleteData } from 'src/react-query/useFetchApis'; // Import the useDeleteData hook
import CloseIcon from '@mui/icons-material/Close'; // Import the close icon
import AddDevice from './AddDevices'; // Import the AddDevice component
import EditDevice from './EditDevices'; // Import the EditDevice component
import { useQueryClient } from 'react-query'; // Import useQueryClient to invalidate queries

// Table component
const DeviceAllocation = () => {
  const {
    data,
    isLoading: isFetching,
    error,
  } = useFetchData('devices', '/devices/');
  const [showAddDevice, setShowAddDevice] = React.useState(false); // State to control visibility of AddDevice dialog
  const [showEditDevice, setShowEditDevice] = React.useState(false); // State to control visibility of EditDevice dialog
  const [selectedDeviceId, setSelectedDeviceId] = React.useState(null); // State to store the selected device ID for deletion
  const [selectedDevice, setSelectedDevice] = React.useState(null); // State to store the selected device data for editing
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false); // State to control the delete confirmation dialog
  const [snackbarOpen, setSnackbarOpen] = React.useState(false); // State to control the snackbar visibility
  const [snackbarMessage, setSnackbarMessage] = React.useState(''); // State to store the snackbar message

  const queryClient = useQueryClient(); // Get the query client

  // Construct the full URL for deletion
  const deleteUrl = selectedDeviceId
    ? `/devices/delete/${selectedDeviceId}/`
    : null;

  // Use the useDeleteData hook at the top level
  const { isLoading: isDeleting, mutate: deleteDevice } = useDeleteData(
    'devices',
    deleteUrl,
  );

  // Function to handle device deletion
  const handleDeleteDevice = (deviceId) => {
    setSelectedDeviceId(deviceId); // Set the selected device ID
    setOpenDeleteDialog(true); // Open the delete confirmation dialog
  };

  // Function to handle device editing
  const handleEditDevice = (device) => {
    if (device) {
      setSelectedDevice(device); // Set the selected device data
      setShowEditDevice(true); // Open the edit dialog
    }
  };

  // Function to confirm device deletion
  const handleConfirmDelete = () => {
    if (selectedDeviceId) {
      deleteDevice(null, {
        onSuccess: () => {
          setOpenDeleteDialog(false); // Close the delete confirmation dialog
          setSelectedDeviceId(null); // Reset the selected device ID
          setSnackbarMessage('Device deleted successfully'); // Set the success message
          setSnackbarOpen(true); // Show the snackbar
          queryClient.invalidateQueries(['devices']); // Refresh the table data
        },
        onError: () => {
          setSnackbarMessage('Failed to delete device'); // Set the error message
          setSnackbarOpen(true); // Show the snackbar
        },
      });
    }
  };

  // Function to close the delete confirmation dialog
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedDeviceId(null);
  };

  // Function to close the edit dialog
  const handleCloseEditDialog = () => {
    setShowEditDevice(false);
    setSelectedDevice(null);
  };

  // Function to close the snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // Function to handle successful device addition
  const handleDeviceAdded = () => {
    setSnackbarMessage('Device added successfully'); // Set the success message
    setSnackbarOpen(true); // Show the snackbar
    queryClient.invalidateQueries(['devices']); // Refresh the table data
    setShowAddDevice(false); // Close the add device dialog
  };

  // Function to handle successful device update
  const handleDeviceUpdated = () => {
    setSnackbarMessage('Device updated successfully'); // Set the success message
    setSnackbarOpen(true); // Show the snackbar
    queryClient.invalidateQueries(['devices']); // Refresh the table data
    setShowEditDevice(false); // Close the edit dialog
  };

  // Show loading spinner while data is being fetched
  if (isFetching) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Show error message if there's an error fetching data
  if (error) {
    return (
      <Typography color="error" sx={{ textAlign: 'center', mt: 4 }}>
        Error: {error.message}
      </Typography>
    );
  }

  // Function to open the AddDevice dialog
  const handleAddDeviceClick = () => {
    setShowAddDevice(true);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <h2 className="main-heading my-4 text-center">Device Allocation</h2>
      <div className="underline mx-auto"></div>

      {/* Add Device Button */}
      <Button
        variant="contained"
        style={{
          backgroundColor: '#ffc107',
          color: 'black',
        }}
        onClick={handleAddDeviceClick}
      >
        Add Device
      </Button>

      {/* Dialog to show the AddDevice component */}
      <Dialog
        open={showAddDevice}
        onClose={() => setShowAddDevice(false)}
        fullWidth
        maxWidth="sm" // Adjust the dialog size to "sm"
        sx={{ '& .MuiDialog-paper': { width: '100%', maxWidth: '600px' } }} // Custom width
      >
        <DialogTitle>
          Add Device
          <IconButton
            aria-label="close"
            onClick={() => setShowAddDevice(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ paddingLeft: 2, paddingRight: 2 }}>
          <AddDevice onClose={handleDeviceAdded} />{' '}
          {/* Pass the callback to handle successful addition */}
        </DialogContent>
      </Dialog>

      {/* Dialog to show the EditDevice component */}
      <Dialog
        open={showEditDevice}
        onClose={handleCloseEditDialog}
        fullWidth
        maxWidth="sm" // Adjust the dialog size to "sm"
        sx={{ '& .MuiDialog-paper': { width: '100%', maxWidth: '600px' } }} // Custom width
      >
        <DialogTitle>
          Edit Device
          <IconButton
            aria-label="close"
            onClick={handleCloseEditDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ paddingLeft: 2, paddingRight: 2 }}>
          {selectedDevice && ( // Only render EditDevice if selectedDevice is not null
            <EditDevice
              device={selectedDevice} // Pass the selected device data
              onClose={handleDeviceUpdated} // Pass the callback to handle successful update
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Device Allocation Table */}
      <TableContainer
        component={Paper}
        sx={{ borderRadius: 2, boxShadow: 2, mt: 3 }}
      >
        <Table>
          <TableHead sx={{ backgroundColor: '#f2f2f2' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Device Type</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Device Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>About Device</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Allocated To</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>From Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>To Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Purpose</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>{' '}
              {/* New column for actions */}
            </TableRow>
          </TableHead>
          <TableBody>
            {data && data.length > 0 ? (
              data.map((device) => (
                <TableRow key={device.id}>
                  <TableCell>{device.device_type}</TableCell>
                  <TableCell>{device.device_name}</TableCell>
                  <TableCell>{device.about_device}</TableCell>
                  <TableCell>{device.allocated_to}</TableCell>
                  <TableCell>{device.from_date}</TableCell>
                  <TableCell>{device.to_date}</TableCell>
                  <TableCell>{device.purpose}</TableCell>
                  <TableCell>
                    <IconButton
                      aria-label="edit"
                      onClick={() => handleEditDevice(device)} // Pass device data to handleEditDevice
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      aria-label="delete"
                      onClick={() => handleDeleteDevice(device.id)} // Pass device.id to handleDeleteDevice
                      color="error"
                      disabled={isDeleting} // Disable the button while deleting
                    >
                      {isDeleting ? (
                        <CircularProgress size={24} />
                      ) : (
                        <DeleteIcon />
                      )}
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No devices found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this device?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="secondary"
            disabled={isDeleting} // Disable the button while deleting
          >
            {isDeleting ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

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

export default DeviceAllocation;
