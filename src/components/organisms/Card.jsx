import React from 'react';
import PropTypes from 'prop-types';
import { Card as MuiCard, CardContent, Typography, Box } from '@mui/material';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import useAuthStore from 'src/services/store/globalStore';

export const Card = props => {
  function handleClick() {
    useAuthStore.setState({ teamDetails: null });
    useAuthStore.setState({ myWorkData: props });
  }

  return (
    <MuiCard
      onClick={handleClick}
      className="subsidiary-card-modern"
      sx={{
        height: '100%',
        borderRadius: '16px',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: '0 12px 40px rgba(59, 130, 246, 0.2)',
        },
      }}
    >
      <Box
        sx={{
          height: '160px',
          overflow: 'hidden',
          position: 'relative',
          borderRadius: '16px 16px 0 0',
        }}
      >
        <LazyLoadImage
          effect="blur"
          src={props.image}
          alt={props.title || 'Project image'}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'scale(1.08)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        />
        <Box
          className="subsidiary-overlay"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(180deg, transparent 0%, rgba(59, 130, 246, 0.08) 100%)',
            opacity: 0,
            transition: 'opacity 0.4s ease',
          }}
        />
      </Box>
      <CardContent
        sx={{
          p: 2,
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'white',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: '#1a1a1a',
            mb: 1,
            fontSize: { xs: '0.95rem', sm: '1rem' },
            textAlign: 'center',
            lineHeight: 1.3,
            minHeight: '38px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {props.title || props.name}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: '#666',
            lineHeight: 1.5,
            fontSize: { xs: '0.8rem', sm: '0.85rem' },
            textAlign: 'center',
            flexGrow: 1,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {props.description}
        </Typography>
      </CardContent>
    </MuiCard>
  );
};

Card.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string,
  name: PropTypes.string,
  description: PropTypes.string.isRequired,
  link: PropTypes.string,
  timeline: PropTypes.string,
};
