import React, { useState } from 'react';
import { TextField, CircularProgress, Typography } from '@mui/material';
import { useFetchData } from 'src/react-query/useFetchApis';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import FacebookIcon from '@mui/icons-material/Facebook';

const CollegeWhatsappLinks = () => {
  const { data = [], isLoading } = useFetchData(
    'collegeswhatsapplinks',
    '/college_details/',
  );
  const [searchQuery, setSearchQuery] = useState('');

  // Group links by college ID
  const groupedData = data.reduce((acc, item) => {
    const { college, college_name, label, link } = item;
    if (!acc[college]) {
      acc[college] = { college_name, links: {} };
    }
    acc[college].links[label] = link;
    return acc;
  }, {});

  // Filter based on search query
  const searchedData = Object.values(groupedData).filter((college) =>
    college.college_name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <TextField
        id="outlined-search"
        label="Search university"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        type="search"
        sx={{
          width: {
            xs: '100%',
            sm: '300px',
            md: '400px',
            lg: '40%',
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

      {isLoading ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '20px',
          }}
        >
          <CircularProgress />
        </div>
      ) : (
        <>
          {searchedData.length === 0 ? (
            <Typography
              variant="h6"
              color="textSecondary"
              style={{
                textAlign: 'center',
                marginTop: '20px',
              }}
            >
              No results found
            </Typography>
          ) : (
            <ol style={{ lineHeight: '2em', fontSize: '18px' }}>
              {searchedData.map((college, index) => (
                <li key={index}>
                  <span style={{ marginRight: '10px' }}>
                    {college.college_name}
                  </span>
                  {college.links['whatsapp community link'] && (
                    <a
                      href={college.links['whatsapp community link']}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ marginRight: '10px', color: 'green' }}
                    >
                      <WhatsAppIcon />
                    </a>
                  )}
                  {college.links['facebook group link'] && (
                    <a
                      href={college.links['facebook group link']}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#4267B2' }}
                    >
                      <FacebookIcon />
                    </a>
                  )}
                </li>
              ))}
            </ol>
          )}
        </>
      )}
    </div>
  );
};

export default CollegeWhatsappLinks;
