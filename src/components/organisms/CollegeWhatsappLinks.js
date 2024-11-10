import React, { useState } from 'react';
import { TextField } from '@mui/material';
import { useFetchData } from 'src/react-query/useFetchApis';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';

const CollegeWhatsappLinks = () => {
  const { data = [] } = useFetchData(
    'collegeswhatsapplinks',
    '/college_details/'
  );
  const [searchQuery, setSearchQuery] = useState('');

  // Filter the data to only include items with the label 'whatsapp community'
  const filteredData = data.filter(
    (college) => college.label === 'whatsapp community'
  );

  // Further filter the data based on the search query
  const searchedData = filteredData.filter((college) =>
    college.college_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      {/* <TextField
        id="standard-helperText"
        label="Search WhatsApp Links"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        helperText="Enter the college name"
        variant="standard"
        fullWidth
        margin="normal"
      /> */}
      <TextField
        id="outlined-search"
        label="Search university"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        type="search"
        sx={{
          width: {
            xs: '100%', // Full width on extra-small screens (mobile)
            sm: '300px', // 400px width on small screens (tablets)
            md: '400px', // 500px width on medium screens (desktops)
            lg: '40%', // 600px width on large screens (larger desktops)
          },
          marginBottom: '20px',
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

      <ol style={{ lineHeight: '2em', fontSize: '18px', color: '#007bff' }}>
        {searchedData.map((college, index) => (
          <li key={index}>
            <a
              href={college.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none', color: '#007bff' }}
            >
              {college.college_name}
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default CollegeWhatsappLinks;
