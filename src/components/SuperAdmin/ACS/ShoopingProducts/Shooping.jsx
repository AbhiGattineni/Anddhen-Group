import React from 'react';
import AddShooping from './AddShooping';
import ViewShooping from './ViewShooping';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Button,
} from '@mui/material'; // Import Dialog, IconButton, and related components
import CloseIcon from '@mui/icons-material/Close'; // Import the close icon

export const Shooping = () => {
  const [showAddProduct, setShowAddProduct] = React.useState(false); // State to control visibility of AddShooping

  const handleAddProductClick = () => {
    setShowAddProduct(true);
  };

  const handleCloseDialog = () => {
    setShowAddProduct(false); // Function to close the dialog
  };

  return (
    <div className="container my-3">
      <h2 className="main-heading my-4">Shopping Products</h2>
      <Button
        variant="contained"
        style={{
          backgroundColor: '#ffc107',
          color: 'black',
        }}
        onClick={handleAddProductClick}
      >
        Add Shopping Product
      </Button>

      {/* Dialog to show the AddShooping component */}
      <Dialog
        open={showAddProduct}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm" // Adjust the dialog size to "sm"
        sx={{ '& .MuiDialog-paper': { width: '100%', maxWidth: '600px' } }} // Custom width
      >
        <DialogTitle>
          Add Shopping Product
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
          {' '}
          {/* Reduced padding */}
          <AddShooping onClose={handleCloseDialog} />{' '}
          {/* Pass the close function */}
        </DialogContent>
      </Dialog>

      <div style={{ paddingTop: '10px' }}>
        <ViewShooping />
      </div>
    </div>
  );
};

export default Shooping;
