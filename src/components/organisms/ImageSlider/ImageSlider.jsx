import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  IconButton,
  useMediaQuery,
} from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { myworks } from 'src/dataconfig';
import { Card } from '../Card';

const ImageSlider = ({ title, cards }) => {
  const [startIndex, setStartIndex] = useState(0);
  const theme = useTheme();
  const sliderRef = useRef(null);

  // Updated responsive breakpoints
  const isExtraLargeScreen = useMediaQuery(theme.breakpoints.up('lg')); // 4 images
  const isLargeScreen = useMediaQuery(theme.breakpoints.between('md', 'lg')); // 3 images
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md')); // 2 images
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm')); // 1 image

  useEffect(() => {
    setStartIndex(0);
  }, [isExtraLargeScreen, isLargeScreen, isMediumScreen, isSmallScreen]);

  const imagesPerPage = isExtraLargeScreen ? 4 : isLargeScreen ? 3 : isMediumScreen ? 2 : 1;
  const totalImages = cards.length;

  // Scroll Functionality for Mouse Wheel
  const handleScroll = (e) => {
    e.preventDefault();
    if (sliderRef.current) {
      sliderRef.current.scrollLeft += e.deltaY;
    }
  };

  const nextImages = () => {
    setStartIndex((prevIndex) =>
      prevIndex + imagesPerPage < totalImages ? prevIndex + 1 : prevIndex,
    );
  };

  const prevImages = () => {
    setStartIndex((prevIndex) => (prevIndex - 1 >= 0 ? prevIndex - 1 : 0));
  };

  return (
    <Box
      sx={{
        width: '100%',
        margin: 'auto',
        mt: 4,
        p: 2,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="container mt-2">
        {/* Title */}
        <Typography
          variant="h5"
          sx={{
            color: 'black',
            fontWeight: 500, // Less bold
            textAlign: 'center',
            mt: 0.1, // Decreased top margin
            mb: 2,
            fontSize: { xs: '1.2rem', sm: '1.4rem' }, // Slightly smaller font
          }}
        >
          {title}
        </Typography>

        {/* Left Button */}
        <IconButton
          onClick={prevImages}
          disabled={startIndex === 0}
          sx={{
            position: 'absolute',
            left: 40,
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#000',
            '&:hover': { color: '#555' },
            transition: 'all 0.3s ease',
            zIndex: 2,
          }}
        >
          <ArrowBackIos fontSize="small" />
        </IconButton>

        {/* Right Button */}
        <IconButton
          onClick={nextImages}
          disabled={startIndex + imagesPerPage >= totalImages}
          sx={{
            position: 'absolute',
            right: 40,
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#000',
            '&:hover': { color: '#555' },
            transition: 'all 0.3s ease',
            zIndex: 2,
          }}
        >
          <ArrowForwardIos fontSize="small" />
        </IconButton>

        {/* Slider Container (Mouse Scroll Enabled) */}
        <Box
          ref={sliderRef}
          onWheel={handleScroll}
          sx={{
            display: 'flex',
            overflowX: 'auto',
            scrollBehavior: 'smooth',
            width: '100%',
            scrollbarWidth: 'none', // Hide scrollbar in Firefox
            '&::-webkit-scrollbar': { display: 'none' }, // Hide scrollbar in Chrome
          }}
        >
          <Grid
            container
            spacing={2}
            sx={{
              display: 'flex',
              flexWrap: 'nowrap',
              transform: `translateX(-${startIndex * (100 / imagesPerPage)}%)`,
              transition: 'transform 0.5s ease-in-out',
            }}
          >
            {myworks.map((work, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                key={index}
                sx={{
                  flex: `0 0 ${100 / imagesPerPage}%`,
                  textAlign: 'center',
                  p: 1,
                  maxWidth: `${100 / imagesPerPage}%`, // Ensure consistent width
                }}
              >
                <Box
                  sx={{
                    borderRadius: 2,
                    boxShadow: 2,
                    transition: 'all 0.3s ease',
                    height: '100%', // Ensure consistent height
                    display: 'flex',
                    flexDirection: 'column',
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
      </div>
    </Box>
  );
};

export default ImageSlider;

ImageSlider.propTypes = {
  title: PropTypes.string.isRequired,
  cards: PropTypes.arrayOf(
    PropTypes.shape({
      image: PropTypes.string,
      name: PropTypes.string,
      description: PropTypes.string,
      link: PropTypes.string,
      timeline: PropTypes.string,
    }),
  ).isRequired,
};
