import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  IconButton,
  useMediaQuery,
} from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { myworks } from 'src/dataconfig';
import { Card } from '../Card';
import PropTypes from 'prop-types';

const ImageSlider = ({ title, cards }) => {
  const [startIndex, setStartIndex] = useState(0);
  const theme = useTheme();

  // Responsive breakpoints
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md')); // 4 images
  const isMediumScreen = useMediaQuery(theme.breakpoints.only('sm')); // 2 images
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm')); // 1 image

  useEffect(() => {
    setStartIndex(0);
  }, [isLargeScreen, isMediumScreen, isSmallScreen]);

  const imagesPerPage = isLargeScreen ? 3 : isMediumScreen ? 1 : 1; // Adjust number of images dynamically
  const totalImages = cards.length;

  // Dynamic button size
  // const buttonSize = isSmallScreen ? 40 : 50;

  // Function to go to the next set of images (one by one)
  const nextImages = () => {
    setStartIndex((prevIndex) => {
      if (prevIndex + imagesPerPage >= totalImages) return prevIndex;
      return prevIndex + 1;
    });
  };

  // Function to go to the previous set of images (one by one)
  const prevImages = () => {
    setStartIndex((prevIndex) => {
      if (prevIndex - 1 < 0) return 0;
      return prevIndex - 1;
    });
  };

  return (
    <Box
      sx={{
        width: '100%',
        margin: 'auto',
        mt: 4,
        boxShadow: 3,
        borderRadius: 2,
        p: 2,
        backgroundColor: '#f9f9f9',
      }}
    >
      {/* Heading and Navigation Buttons */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
          flexWrap: 'nowrap', // Prevent buttons from wrapping
        }}
      >
        {/* Heading */}
        <Typography
          variant="h5"
          sx={{
            color: 'black',
            fontWeight: 'bold',
            textAlign: 'left',
            fontSize: { xs: '1.25rem', sm: '1.5rem' }, // Smaller title on small screens
          }}
        >
          {title}
        </Typography>

        {/* Navigation Buttons */}
        <Box sx={{ whiteSpace: 'nowrap' }}>
          <IconButton
            onClick={prevImages}
            disabled={startIndex === 0}
            sx={{
              backgroundColor: '#ffc107',
              color: '#fff',
              '&:disabled': { backgroundColor: '#ccc' },
              boxShadow: 2,
              width: 40,
              height: 40,
              transition: 'all 0.3s ease',
              mr: 1,
            }}
          >
            <ArrowBackIos fontSize="small" />
          </IconButton>
          <IconButton
            onClick={nextImages}
            disabled={startIndex + imagesPerPage >= totalImages}
            sx={{
              backgroundColor: '#ffc107',
              color: '#fff',
              '&:disabled': { backgroundColor: '#ccc' },
              boxShadow: 2,
              width: 40,
              height: 40,
              transition: 'all 0.3s ease',
            }}
          >
            <ArrowForwardIos fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Main Slider Container */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
        }}
      >
        {/* Image Grid */}
        <Grid
          container
          spacing={2}
          justifyContent="space-between"
          sx={{
            overflow: 'hidden',
            transition: 'transform 0.5s ease-in-out',
          }}
        >
          {myworks
            .slice(startIndex, startIndex + imagesPerPage)
            .map((work, index) => (
              <Grid
                item
                xs={12}
                sm={12}
                md={4}
                key={startIndex + index}
                sx={{ textAlign: 'center', p: 0 }}
              >
                <Box
                  sx={{
                    p: 0,
                    borderRadius: 2,
                    objectFit: 'cover',
                    boxShadow: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.02)',
                      boxShadow: 4,
                    },
                  }}
                >
                  <Card
                    image={work.image}
                    title={work.name}
                    description={work.description}
                    link={work.link}
                    timeline={work.timeline}
                  />
                </Box>
              </Grid>
            ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default ImageSlider;

ImageSlider.propTypes = {
  title: PropTypes.string.isRequired, // `title` must be a string
  cards: PropTypes.arrayOf(
    PropTypes.shape({
      image: PropTypes.string,
      name: PropTypes.string,
      description: PropTypes.string,
      link: PropTypes.string,
      timeline: PropTypes.string,
    }),
  ).isRequired, // `cards` is an array of objects
};
