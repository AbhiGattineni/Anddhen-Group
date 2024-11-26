import React from 'react';
//import {addTeamMember} from './addTeamMember';
import ViewTeam from './viewTeamMember';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { AddTeamMember } from './addTeamMember';
import { AssTeamModal } from 'src/components/organisms/Modal/AssTeamModel';
export const OurTeam = () => {
  const [showAddTeamMember, setShowAddTeamMember] = React.useState(false); // State to control visibility of AddTeamMember dialog

  const handleAddTeamMemberClick = () => {
    setShowAddTeamMember(true);
  };

  const handleCloseDialog = () => {
    setShowAddTeamMember(false); // Function to close the dialog
  };

  return (
    <div className="container my-3">
      <h2 className="main-heading my-4">Our Team</h2>
      <Button
        variant="contained"
        style={{
          backgroundColor: '#ffc107',
          color: 'black',
        }}
        onClick={handleAddTeamMemberClick}
      >
        Add Team Member
      </Button>
      <AddTeamMember />

      {/* Dialog to show the AddTeamMember component */}
      <Dialog
        open={showAddTeamMember}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm" // Adjust the dialog size to "sm"
        sx={{ '& .MuiDialog-paper': { width: '100%', maxWidth: '600px' } }} // Custom width
      >
        <DialogTitle>
          Add Team Member
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
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
          {/* Reduced padding */}
          <AddTeamMember
            open={showAddTeamMember}
            onClose={handleCloseDialog}
          />{' '}
          {/* Pass the close function */}
        </DialogContent>
      </Dialog>

      <div style={{ paddingTop: '10px' }}>
        <ViewTeam />
      </div>
      <AssTeamModal />
    </div>
  );
};

export default OurTeam;
