import React, { useState } from 'react';
import 'src/components/organisms/Card.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import useAuthStore from 'src/services/store/globalStore';
import { useFetchData, useDeleteData } from 'src/react-query/useFetchApis';
import {
  IconButton,
  TextField,
  MenuItem,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EditTeamMember from './editTeamMember'; // Ensure this is the correct path
import { useQueryClient } from 'react-query';

const Cards = () => {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const {
    data: teamData,
    isLoading,
    error,
  } = useFetchData('teamMembers', '/team_members/');

  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubsidiary, setFilterSubsidiary] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editedMember, setEditedMember] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const queryClient = useQueryClient();

  // Hook for deleting a team member
  const { mutate: deleteCollege } = useDeleteData(
    'teamMembers',
    `/team_members/delete/${deleteId}/`,
  );

  const handleDeleteTeam = () => {
    deleteCollege(null, {
      onSuccess: () => {
        queryClient.invalidateQueries('teamMembers');
        setDeleteId(null);
        setOpenDialog(false);
      },
      onError: (error) => {
        console.error('An error occurred:', error);
      },
    });
  };

  function handleClick(detail) {
    useAuthStore.setState({ myWorkData: null });
    useAuthStore.setState({ teamDetails: detail });
  }

  function handleEdit(detail) {
    setEditedMember(detail);
    setEditDialogOpen(true);
  }

  function handleCloseEditDialog() {
    setEditDialogOpen(false);
    setEditedMember(null);
  }

  function handleOpenDeleteDialog(id) {
    setDeleteId(id);
    setOpenDialog(true);
  }

  function handleCloseDialog() {
    setOpenDialog(false);
    setDeleteId(null);
  }

  const filteredTeamData = teamData?.filter((detail) => {
    const matchesSearchTerm = detail.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesSubsidiary = filterSubsidiary
      ? detail.subsidiary === filterSubsidiary
      : true;
    return matchesSearchTerm && matchesSubsidiary;
  });

  if (isLoading)
    return (
      <div className="spinner-border spinner-border-sm" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    );
  if (error) return <div>Error loading data</div>;

  return (
    <section className="section">
      <div className="container">
        <div className="row mb-4">
          <div className="col-md-12 mx-auto">
            <Grid
              container
              spacing={2}
              alignItems="center"
              justifyContent="flex-start"
            >
              <Grid item>
                <TextField
                  fullWidth
                  label="Search by Name"
                  variant="outlined"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  margin="normal"
                  sx={{
                    borderRadius: '20px',
                    width: {
                      xs: '150%',
                      sm: '400px',
                      md: '400px',
                    },
                    height: '40px',
                  }}
                />
              </Grid>

              <Grid item>
                <TextField
                  select
                  label="Subsidiary"
                  variant="outlined"
                  value={filterSubsidiary}
                  onChange={(e) => setFilterSubsidiary(e.target.value)}
                  margin="normal"
                  sx={{
                    borderRadius: '20px',
                    width: '150px',
                    height: '40px',
                  }}
                >
                  <MenuItem value="">
                    <em>All</em>
                  </MenuItem>
                  {['acs', 'ass', 'ans', 'ams', 'ats', 'ati', 'aps'].map(
                    (option) => (
                      <MenuItem key={option} value={option}>
                        {option.toUpperCase()}
                      </MenuItem>
                    ),
                  )}
                </TextField>
              </Grid>
            </Grid>
          </div>
        </div>

        <div className="border rounded row">
          {filteredTeamData &&
            filteredTeamData.map((detail) => (
              <div className="col-lg-3 col-md-4 col-sm-6 mb-5" key={detail.id}>
                <div
                  className="card shadow mt-2 p-1 border border-1 cursor-pointer"
                  onClick={() => handleClick(detail)}
                >
                  <div className="position-absolute top-0 end-0">
                    <IconButton
                      aria-label="edit"
                      size="small"
                      color="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(detail);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      aria-label="delete"
                      size="small"
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDeleteDialog(detail.id);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                  <div className="image">
                    <img
                      src={`${API_BASE_URL}${detail.image}`}
                      alt={detail.name}
                    />
                  </div>
                  <div className="card-body text-center p-1">
                    <h5>{detail.name}</h5>
                    <p>
                      {detail.work_time_from} - {detail.work_time_to}
                    </p>
                    <p>{detail.role}</p>
                    <div className="socials">
                      <a href={detail.facebook_link}>
                        <i id="f" className="bi bi-facebook"></i>
                      </a>
                      <a href={detail.linkedin_link}>
                        <i id="l" className="bi bi-linkedin"></i>
                      </a>
                      <a href={detail.github_link}>
                        <i id="t" className="bi bi-github"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>

        <Dialog open={editDialogOpen} onClose={handleCloseEditDialog}>
          <EditTeamMember
            member={editedMember}
            onClose={handleCloseEditDialog}
          />
        </Dialog>

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this profile?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDeleteTeam} color="error" autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </section>
  );
};

export default Cards;
