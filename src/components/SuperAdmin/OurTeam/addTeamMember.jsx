import React, { useState } from 'react';
import { useAddData } from 'src/react-query/useFetchApis'; // Adjust the import path as needed
import PropTypes from 'prop-types';
import {
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  MenuItem,
  Snackbar,
  Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useQueryClient } from 'react-query';

export const AddTeamMember = ({ open, onClose }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: '',
    work_time_from: '',
    work_time_to: '',
    role: '',
    description: '',
    image: null,
    facebook_link: '',
    linkedin_link: '',
    github_link: '',
    subsidiary: '',
  });
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const { mutate: addTeamMember, isLoading } = useAddData(
    'teamMembers',
    '/team_members/add/'
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
    setSnackbar({
      open: true,
      message: 'Image added successfully!',
      severity: 'success',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length === 0) {
      const submitData = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] instanceof File) {
          // For file inputs, append the actual file
          submitData.append(key, formData[key]);
        } else {
          // Append other form data as strings
          submitData.append(key, String(formData[key]));
        }
      });

      addTeamMember(submitData, {
        onSuccess: () => {
          queryClient.invalidateQueries('teamMembers');
          setSnackbar({
            open: true,
            message: 'Team member added successfully!',
            severity: 'success',
          });
          setFormData({
            name: '',
            work_time_from: '',
            work_time_to: '',
            role: '',
            description: '',
            image: null,
            facebook_link: '',
            linkedin_link: '',
            github_link: '',
            subsidiary: '',
          });
          setErrors({});
          onClose();
        },
        onError: (error) => {
          console.error('An error occurred:', error);
          setSnackbar({
            open: true,
            message: 'An error occurred. Please try again.',
            severity: 'error',
          });
        },
      });
    } else {
      setErrors(validationErrors);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name) errors.name = 'Name is required';
    if (!formData.work_time_from)
      errors.work_time_from = 'Start date is required';
    if (!formData.work_time_to) errors.work_time_to = 'End date is required';
    if (!formData.role) errors.role = 'Role is required';
    if (!formData.subsidiary) errors.subsidiary = 'Subsidiary is required';
    return errors;
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: '', severity: 'success' });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        Add Team Member
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
        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            name="name"
            fullWidth
            required
            margin="normal"
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            label="Start Date"
            name="work_time_from"
            type="date"
            fullWidth
            required
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={formData.work_time_from}
            onChange={handleChange}
            error={!!errors.work_time_from}
            helperText={errors.work_time_from}
          />
          <TextField
            label="End Date"
            name="work_time_to"
            type="date"
            fullWidth
            required
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={formData.work_time_to}
            onChange={handleChange}
            error={!!errors.work_time_to}
            helperText={errors.work_time_to}
          />
          <TextField
            label="Role"
            name="role"
            fullWidth
            required
            margin="normal"
            value={formData.role}
            onChange={handleChange}
            error={!!errors.role}
            helperText={errors.role}
          />
          <TextField
            label="Description"
            name="description"
            multiline
            rows={4}
            fullWidth
            margin="normal"
            value={formData.description}
            onChange={handleChange}
          />
          <Button
            variant="contained"
            component="label"
            fullWidth
            sx={{ mt: 2, mb: 2 }}
          >
            Upload Image
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
          </Button>
          <TextField
            label="Facebook Link"
            name="facebook_link"
            fullWidth
            margin="normal"
            value={formData.facebook_link}
            onChange={handleChange}
          />
          <TextField
            label="LinkedIn Link"
            name="linkedin_link"
            fullWidth
            margin="normal"
            value={formData.linkedin_link}
            onChange={handleChange}
          />
          <TextField
            label="GitHub Link"
            name="github_link"
            fullWidth
            margin="normal"
            value={formData.github_link}
            onChange={handleChange}
          />
          <TextField
            label="Subsidiary"
            name="subsidiary"
            select
            fullWidth
            required
            margin="normal"
            value={formData.subsidiary}
            onChange={handleChange}
            error={!!errors.subsidiary}
            helperText={errors.subsidiary}
          >
            {['acs', 'ass', 'ans', 'ams', 'ats', 'ati', 'aps'].map((option) => (
              <MenuItem key={option} value={option}>
                {option.toUpperCase()}
              </MenuItem>
            ))}
          </TextField>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '16px',
            }}
          >
            <Button onClick={onClose} color="secondary">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isLoading}
              sx={{ backgroundColor: '#ffc107', color: 'black' }}
            >
              {isLoading ? 'Adding...' : 'Add Team Member'}
            </Button>
          </div>
        </form>
      </DialogContent>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

AddTeamMember.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
