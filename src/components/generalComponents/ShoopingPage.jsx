import React, { useState } from 'react';
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
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { shoopingForNRI } from '../../../src/dataconfig'; // Adjust the path based on your file structure

const ShoppingPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [ageGroup, setAgeGroup] = useState('');

  // Filter the products based on the search query and age group
  const filteredProducts = shoopingForNRI
    .filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((product) => (ageGroup ? product.agegroup === ageGroup : true));

  return (
    <section>
      <Container>
        <Typography
          variant="h4"
          sx={{ textAlign: 'center', marginBottom: '0px' }}
        >
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
          {/* Search Bar */}
          <TextField
            id="outlined-search"
            label="Search Products"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            type="search"
            sx={{
              flex: 1,
              '& .MuiOutlinedInput-root': {
                height: '40px',
                padding: '0',
              },
              '& .MuiOutlinedInput-input': {
                padding: '8px 14px',
              },
              '& .MuiInputLabel-root': {
                top: '-7px',
                fontSize: '16px',
              },
              '& .MuiInputLabel-shrink': {
                top: '0',
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          {/* Filter Dropdown */}
          <FormControl
            variant="outlined"
            size="small"
            sx={{
              minWidth: '120px',
              '& .MuiOutlinedInput-root': {
                height: '40px',
                padding: '0',
              },
            }}
          >
            <InputLabel id="filter-label">Filter</InputLabel>
            <Select
              labelId="filter-label"
              value={ageGroup}
              onChange={(e) => setAgeGroup(e.target.value)}
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
            {filteredProducts.map((product, index) => (
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
                  }}
                  onClick={() => window.open(product.link, '_blank')} // Opens the link in a new tab
                >
                  <CardMedia
                    component="img"
                    height="150"
                    image={product.image} // Use image from the config
                    alt={product.description}
                    sx={{ objectFit: 'contain' }} // Ensures the complete image is visible
                  />
                  <CardContent>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ fontSize: '15px', color: 'blue' }}
                    >
                      {product.name} {/* Display the product name */}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: '12px', marginTop: '4px' }}
                    >
                      {product.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </section>
  );
};

export default ShoppingPage;
