import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  CardMedia,
  Box,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Snackbar,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useFetchData } from 'src/react-query/useFetchApis'; // Ensure the path is correct
import { useDeleteData } from 'src/react-query/useFetchApis'; // Ensure the path is correct
import EditShopping from '../SuperAdmin/ACS/ShoopingProducts/EditShooping'; // Import the EditShopping component
import { useQueryClient } from 'react-query';

const ShoppingPage = () => {
  const location = useLocation(); // Get the current location object

  const shouldShowIcons = !location.pathname.includes('/ans');
  const queryClient = useQueryClient();
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const [searchQuery, setSearchQuery] = useState('');
  const [ageGroup, setAgeGroup] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editedProduct, setEditedProduct] = useState(null); // State for the product being edited
  const [products, setProducts] = useState([]);

  const { data = [], isLoading, error } = useFetchData('products', '/products/');

  useEffect(() => {
    setProducts(data); // Set the products state to the fetched data
  }, [data]);

  const { mutate: deleteProduct } = useDeleteData(
    'products',
    `/products/delete/${selectedProductId}/`
  );

  if (isLoading) return <p>Loading products...</p>;
  if (error) return <p>Error loading products</p>;

  const filteredProducts = products
    .filter(product => product.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(product => (ageGroup ? product.age_group === ageGroup : true)); // Change agegroup to age_group

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleDeleteClick = productId => {
    setSelectedProductId(productId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProductId(null);
  };

  const handleConfirmDelete = () => {
    deleteProduct(null, {
      onSuccess: () => {
        queryClient.invalidateQueries('products');
        setSnackbarMessage('Product deleted successfully');
        setSnackbarOpen(true);
        handleCloseDialog();
      },
    });
  };

  const handleEditClick = product => {
    setEditedProduct(product); // Set the product data to be edited
    setEditDialogOpen(true); // Open the edit dialog
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditedProduct(null);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <section>
      <Container>
        <Typography variant="h4" sx={{ textAlign: 'center', marginBottom: '0px' }}>
          NRI Shopping
        </Typography>

        <div className="underline mx-auto"></div>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '20px',
          }}
        >
          <TextField
            id="outlined-search"
            label="Search Products"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            type="search"
            sx={{
              flex: 1,
              '& .MuiOutlinedInput-root': { height: '40px', padding: '0' },
              '& .MuiOutlinedInput-input': { padding: '8px 14px' },
              '& .MuiInputLabel-root': { top: '-7px', fontSize: '16px' },
              '& .MuiInputLabel-shrink': { top: '0' },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          <FormControl
            variant="outlined"
            size="small"
            sx={{
              minWidth: '120px',
              '& .MuiOutlinedInput-root': { height: '40px', padding: '0' },
            }}
          >
            <InputLabel id="filter-label">Filter</InputLabel>
            <Select
              labelId="filter-label"
              value={ageGroup}
              onChange={e => setAgeGroup(e.target.value)}
              label="Filter"
              IconComponent={FilterAltIcon}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="0-20">0-20</MenuItem>
              <MenuItem value="20-50">20-50</MenuItem>
              <MenuItem value="50+">50+</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box
          sx={{
            padding: '20px',
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
          }}
        >
          <Grid container spacing={4}>
            {currentProducts.map((product, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    padding: '16px',
                    height: '350px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    cursor: 'pointer',
                    position: 'relative',
                  }}
                  onClick={() => window.open(product.link, '_blank')}
                >
                  <CardMedia
                    component="img"
                    height="250"
                    image={`${API_BASE_URL}${product.image}`}
                    alt={product.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Box>
                      <Typography variant="h5">{product.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {product.description}
                      </Typography>
                    </Box>

                    {shouldShowIcons && ( // Conditionally render the icon buttons
                      <Box
                        sx={{
                          display: 'flex',
                          gap: '3px',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                          position: 'absolute', // Make the box absolutely positioned
                          top: '260px', // Move it upwards
                          right: '5px', // Move it to the right
                        }}
                      >
                        <IconButton
                          onClick={e => {
                            e.stopPropagation(); // Prevent triggering onClick of Card
                            handleEditClick(product);
                          }}
                          sx={{
                            color: '#f76c2f',
                            borderRadius: '10%',
                            padding: '2px',
                          }}
                        >
                          <EditIcon />
                        </IconButton>

                        <IconButton
                          onClick={e => {
                            e.stopPropagation(); // Prevent triggering onClick of Card
                            handleDeleteClick(product.id);
                          }}
                          sx={{
                            color: 'red',
                            borderRadius: '10%',
                            padding: '2px',
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {filteredProducts.length === 0 && (
            <Typography variant="h6" align="center" sx={{ marginTop: '20px' }}>
              No products found.
            </Typography>
          )}

          <Pagination
            count={Math.ceil(filteredProducts.length / productsPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '20px',
            }}
          />
        </Box>

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <DialogContentText>Are you sure you want to delete this product?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleConfirmDelete} color="secondary">
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          message={snackbarMessage}
        />

        <Dialog open={editDialogOpen} onClose={handleCloseEditDialog}>
          <EditShopping product={editedProduct} onClose={handleCloseEditDialog} />
        </Dialog>
      </Container>
    </section>
  );
};

export default ShoppingPage;
