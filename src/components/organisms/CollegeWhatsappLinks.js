import React, { useState } from 'react';
import { TextField, CircularProgress, Typography, Box } from '@mui/material';
import { useFetchData } from 'src/react-query/useFetchApis';
import { Search as SearchIcon } from '@mui/icons-material';
import InputAdornment from '@mui/material/InputAdornment';
import { WhatsApp as WhatsAppIcon } from '@mui/icons-material';
import FacebookIcon from '@mui/icons-material/Facebook';

const CollegeWhatsappLinks = () => {
  const {
    data = [],
    isLoading,
    isError,
  } = useFetchData('collegeswhatsapplinks', '/college_details/');
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
  const searchedData = Object.values(groupedData).filter(college =>
    college.college_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box
      sx={{
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        position: 'relative',
        zIndex: 2,
        '& *': {
          color: 'inherit',
        },
      }}
    >
      <TextField
        id="outlined-search"
        label="Search university"
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        type="search"
        sx={{
          width: { xs: '100%', sm: '300px', md: '400px', lg: '40%' },
          marginBottom: '20px',
          '& .MuiOutlinedInput-root': { height: '40px', padding: '0' },
          '& .MuiOutlinedInput-input': { padding: '8px 14px' },
          '& .MuiInputLabel-root': { top: '-7px', fontSize: '16px' },
          '& .MuiInputLabel-shrink': { top: '0' },
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <SearchIcon sx={{ color: '#666' }} />
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
      ) : isError ? (
        <Typography variant="h6" color="error" style={{ textAlign: 'center', marginTop: '20px' }}>
          Network error! Please try again later.
        </Typography>
      ) : searchedData.length === 0 ? (
        <Typography
          variant="h6"
          color="textSecondary"
          style={{ textAlign: 'center', marginTop: '20px' }}
        >
          No fields to show.
        </Typography>
      ) : (
        <Box
          component="ol"
          sx={{
            lineHeight: '2em',
            fontSize: '18px',
            color: '#1a1a1a !important',
            paddingLeft: '20px',
            margin: 0,
            '& li': {
              color: '#1a1a1a !important',
              marginBottom: '8px',
              listStyleType: 'decimal',
              '& span': {
                color: '#1a1a1a !important',
                fontWeight: 500,
                marginRight: '10px',
              },
              '& a': {
                display: 'inline-flex',
                alignItems: 'center',
                textDecoration: 'none',
                marginRight: '10px',
                '&:hover': {
                  opacity: 0.8,
                },
              },
            },
          }}
        >
          {searchedData.map((college, index) => (
            <Box
              component="li"
              key={index}
              sx={{
                color: '#1a1a1a !important',
                marginBottom: '8px',
              }}
            >
              <Box
                component="span"
                sx={{
                  color: '#1a1a1a !important',
                  fontWeight: 500,
                  marginRight: '10px',
                }}
              >
                {college.college_name}
              </Box>
              {college.links['whatsapp community link'] && (
                <Box
                  component="a"
                  href={college.links['whatsapp community link']}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    marginRight: '10px',
                    color: '#25D366 !important',
                    display: 'inline-flex',
                    alignItems: 'center',
                    textDecoration: 'none',
                  }}
                >
                  <WhatsAppIcon sx={{ fontSize: '24px', color: '#25D366 !important' }} />
                </Box>
              )}
              {college.links['facebook group link'] && (
                <Box
                  component="a"
                  href={college.links['facebook group link']}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: '#4267B2 !important',
                    display: 'inline-flex',
                    alignItems: 'center',
                    textDecoration: 'none',
                  }}
                >
                  <FacebookIcon sx={{ fontSize: '24px', color: '#4267B2 !important' }} />
                </Box>
              )}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default CollegeWhatsappLinks;
