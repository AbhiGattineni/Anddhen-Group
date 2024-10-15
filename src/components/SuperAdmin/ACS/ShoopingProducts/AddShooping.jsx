import React, { useState } from 'react';
import {
  TextField,
  Button,
  Snackbar,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import PropTypes from 'prop-types'; // Import PropTypes
import { useAddData } from '../../../../../src/react-query/useFetchApis'; // Import your useAddData hook
import { useQueryClient } from 'react-query';

const AddShopping = ({ onClose }) => {
  // Receive onClose as a prop
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: '',
    image: null,
    link: '',
    age_group: '',
    description: '',
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar state
  const [snackbarMessage, setSnackbarMessage] = useState(''); // Message state

  // Use the custom React Query mutation hook
  const { mutate, isLoading, isError, isSuccess } = useAddData(
    'products',
    '/products/add/'
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAgeGroupChange = (e) => {
    setFormData({
      ...formData,
      age_group: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0], // Capture the uploaded image file
    });

    // Display a message after the image is selected
    if (e.target.files[0]) {
      setSnackbarMessage('Image uploaded successfully');
    } else {
      setSnackbarMessage('Image upload failed');
    }
    setSnackbarOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] instanceof File) {
        submitData.append(key, formData[key]);
      } else {
        submitData.append(key, String(formData[key]));
      }
    });

    // Trigger the mutation to send data to the backend
    mutate(submitData);
  };

  // React effect to show success message when the product is added
  React.useEffect(() => {
    if (isSuccess) {
      setSnackbarMessage('Product added successfully');
      setSnackbarOpen(true);
      queryClient.invalidateQueries('products');
    }
  }, [isSuccess]);

  // React effect to show error message if product addition fails
  React.useEffect(() => {
    if (isError) {
      setSnackbarMessage('Error adding product. Please try again.');
      setSnackbarOpen(true);
    }
  }, [isError]);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false); // Close the Snackbar
  };

  return (
    <div style={{ padding: '24px', maxWidth: '500px', margin: 'auto' }}>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <TextField
            label="Product Name"
            variant="outlined"
            fullWidth
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <Button variant="contained" component="label" fullWidth>
            Upload Image
            <input
              type="file"
              hidden
              accept="image/*"
              name="image"
              onChange={handleImageChange}
              required
            />
          </Button>
        </div>
        <div style={{ marginBottom: '16px' }}>
          <TextField
            label="Product Link"
            variant="outlined"
            fullWidth
            name="link"
            value={formData.link}
            onChange={handleInputChange}
            required
          />
        </div>
        <div style={{ marginBottom: '16px' }}>
          {/* Age Group dropdown */}
          <FormControl fullWidth>
            <InputLabel>Age Group</InputLabel>
            <Select
              name="age_group"
              value={formData.age_group}
              onChange={handleAgeGroupChange}
              required
              label="Age Group"
            >
              <MenuItem value="0-20">0-20</MenuItem>
              <MenuItem value="20-50">20-50</MenuItem>
              <MenuItem value="50+">50+</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div style={{ marginBottom: '16px' }}>
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            name="description"
            value={formData.description}
            onChange={handleInputChange}
          />
        </div>

        {/* Button Container */}
        <div
          style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}
        >
          <Button
            onClick={onClose} // Cancel button action
            color="primary"
            sx={{ fontSize: '0.875rem' }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{
              fontSize: '0.875rem',
              backgroundColor: '#ffc107',
              color: 'black',
              padding: '8px 16px',
            }}
            disabled={isLoading}
          >
            {isLoading ? 'Adding...' : 'Add Product'}
          </Button>
        </div>
      </form>

      {/* Snackbar for showing messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </div>
  );
};

// Add prop types validation
AddShopping.propTypes = {
  onClose: PropTypes.func.isRequired, // Define the expected type for onClose
};

export default AddShopping;
