import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useUpdateData } from 'src/react-query/useFetchApis';
import { useQueryClient } from 'react-query';

const EditShopping = ({ product, onClose, onUpdateSuccess }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: '',
    image: null,
    link: '',
    age_group: '',
    description: '',
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const { mutate: updateProduct, isLoading } = useUpdateData(
    'products',
    `/products/update/${product?.id}/`
  );

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        image: null,
        link: product.link || '',
        age_group: product.age_group || '',
        description: product.description || '',
      });
    }
  }, [product]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAgeGroupChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      age_group: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
      setSnackbarMessage('Image uploaded successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = new FormData();

    Object.keys(formData).forEach((key) => {
      if (key === 'image' && formData[key]) {
        submitData.append(key, formData[key]);
      } else if (formData[key] !== '') {
        submitData.append(key, String(formData[key]));
      }
    });

    updateProduct(submitData, {
      onSuccess: () => {
        queryClient.invalidateQueries('products');
        setSnackbarMessage('Product updated successfully!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        onUpdateSuccess();
        onClose();
      },
      onError: (error) => {
        const errorMessage =
          error.response?.data?.message || error.message || 'An error occurred';
        setSnackbarMessage(`Error: ${errorMessage}`);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      },
    });
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Dialog
        open
        onClose={onClose}
        fullWidth
        maxWidth="sm"
        sx={{ '& .MuiDialog-paper': { maxHeight: '100vh' } }}
      >
        <DialogTitle>
          Edit Product
          <IconButton
            aria-label="close"
            onClick={onClose}
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
        <DialogContent>
          <Typography
            variant="body2"
            gutterBottom
            sx={{ mb: 2, fontSize: '0.875rem' }}
          >
            Modify the product details below:
          </Typography>
          <form onSubmit={handleSubmit}>
            <Box
              mb={2}
              sx={{ '& .MuiTextField-root': { fontSize: '0.875rem' } }}
            >
              <TextField
                label="Product Name"
                variant="outlined"
                fullWidth
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                sx={{
                  '& .MuiInputBase-input': {
                    fontSize: '0.875rem',
                    padding: '10px',
                  },
                }}
              />
            </Box>

            <Box mb={2}>
              <Button
                variant="contained"
                component="label"
                fullWidth
                sx={{
                  fontSize: '0.875rem',
                  padding: '8px',
                }}
              >
                Upload Image (Optional)
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  name="image"
                  onChange={handleImageChange}
                />
              </Button>
            </Box>

            <Box mb={2}>
              <TextField
                label="Product Link"
                variant="outlined"
                fullWidth
                name="link"
                value={formData.link}
                onChange={handleInputChange}
                required
                sx={{
                  '& .MuiInputBase-input': {
                    fontSize: '0.875rem',
                    padding: '10px',
                  },
                }}
              />
            </Box>

            <Box mb={2}>
              <FormControl fullWidth required>
                <InputLabel>Age Group</InputLabel>
                <Select
                  name="age_group"
                  label="age_group"
                  variant="outlined"
                  value={formData.age_group}
                  onChange={handleAgeGroupChange}
                  sx={{ fontSize: '0.875rem' }}
                >
                  <MenuItem value="0-20">0-20</MenuItem>
                  <MenuItem value="20-50">20-50</MenuItem>
                  <MenuItem value="50+">50+</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box mb={2}>
              <TextField
                label="Description"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                sx={{
                  '& .MuiInputBase-input': {
                    fontSize: '0.875rem',
                    padding: '10px',
                  },
                }}
              />
            </Box>
            <DialogActions>
              <Button
                onClick={onClose}
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
                {isLoading ? 'Updating...' : 'Update'}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

// Add PropTypes validation
EditShopping.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
    link: PropTypes.string,
    age_group: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdateSuccess: PropTypes.func.isRequired,
};

export default EditShopping;
