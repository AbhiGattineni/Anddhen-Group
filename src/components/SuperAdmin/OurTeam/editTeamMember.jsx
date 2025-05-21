import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import MenuItem from '@mui/material/MenuItem';
import { DialogContent, DialogActions, Button, TextField, Snackbar, Alert } from '@mui/material';
import { useUpdateData } from 'src/react-query/useFetchApis';
import { useQueryClient } from 'react-query';

const EditTeamMember = ({ member, onClose, setToast, resetForm }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: '',
    work_time_from: '',
    work_time_to: '',
    role: '',
    description: '',
    facebook_link: '',
    linkedin_link: '',
    github_link: '',
    subsidiary: '',
    image: null, // Added for image handling
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    if (member) {
      setFormData({ ...member, image: member.image || null });
    }
  }, [member]);

  const { mutate: updateTeamMember, isLoading } = useUpdateData(
    'teamMembers',
    `/team_members/update/${member?.id}/`
  );

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setSnackbar({
        open: true,
        message: 'Image uploaded successfully!',
        severity: 'success',
      });
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const updatedData = new FormData();
      Object.keys(formData).forEach(key => {
        updatedData.append(key, formData[key]);
      });

      await updateTeamMember(updatedData, {
        onSuccess: () => {
          queryClient.invalidateQueries('teamMembers');
          resetForm();
          setToast({
            show: true,
            message: 'Team member updated successfully!',
            color: '#82DD55',
          });
          setTimeout(() => setToast({ show: false, message: '', color: undefined }), 3000);
          setSnackbar({
            open: true,
            message: 'Form updated successfully!',
            severity: 'success',
          });
          onClose();
        },
        onError: error => {
          console.error('An error occurred:', error);
          setToast({
            show: true,
            message: 'Something went wrong!',
            color: '#E23636',
          });
          setTimeout(() => setToast({ show: false, message: '', color: undefined }), 3000);
          setSnackbar({
            open: true,
            message: 'Update failed!',
            severity: 'error',
          });
        },
      });
    } catch (error) {
      console.error('Update error:', error.message);
      setToast({
        show: true,
        message: `Update failed: ${error.message}`,
        color: '#E23636',
      });
      setTimeout(() => setToast({ show: false, message: '', color: undefined }), 3000);
      setSnackbar({
        open: true,
        message: `Update failed: ${error.message}`,
        severity: 'error',
      });
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div>
      <DialogContent
        sx={{
          maxHeight: '400px', // Set a maximum height
          overflowY: 'auto', // Enable vertical scrolling
        }}
      >
        <TextField
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Work Time From"
          name="work_time_from"
          type="date"
          value={formData.work_time_from}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Work Time To"
          name="work_time_to"
          type="date"
          value={formData.work_time_to}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          fullWidth
          margin="normal"
          multiline
          rows={4}
        />
        <Button
          variant="contained"
          component="label"
          sx={{
            fontSize: '0.875rem',
            padding: '8px',
            whiteSpace: 'nowrap',
            height: '50px',
            marginTop: '16px',
          }}
        >
          Upload Image (Optional)
          <input type="file" hidden accept="image/*" name="image" onChange={handleImageChange} />
        </Button>
        <TextField
          label="Facebook Link"
          name="facebook_link"
          value={formData.facebook_link}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="LinkedIn Link"
          name="linkedin_link"
          value={formData.linkedin_link}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="GitHub Link"
          name="github_link"
          value={formData.github_link}
          onChange={handleChange}
          fullWidth
          margin="normal"
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
        >
          {['acs', 'ass', 'ans', 'ams', 'ats', 'ati', 'aps'].map(option => (
            <MenuItem key={option} value={option}>
              {option.toUpperCase()}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

EditTeamMember.propTypes = {
  member: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    work_time_from: PropTypes.string,
    work_time_to: PropTypes.string,
    role: PropTypes.string,
    description: PropTypes.string,
    facebook_link: PropTypes.string,
    linkedin_link: PropTypes.string,
    github_link: PropTypes.string,
    subsidiary: PropTypes.string,
    image: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
  setToast: PropTypes.func.isRequired,
  resetForm: PropTypes.func.isRequired,
};

export default EditTeamMember;
