import React, { useState } from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ResumeComponent from './ResumeComponent';

const ResumeHome = () => {
  const theme = useTheme();
  const [showResumeComponent, setShowResumeComponent] = useState(false);

  const handleGetStartedClick = () => {
    setShowResumeComponent(true);
  };

  // If `showResumeComponent` is true, render ResumeComponent, otherwise render welcome content
  if (showResumeComponent) {
    return <ResumeComponent />;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'center',
        justifyContent: 'space-between',
        my: 5,
        padding: { xs: 2, md: 5 },
        width: '100%',
      }}
    >
      {/* Left Content - Resume Builder Text and Description */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          mb: { xs: 4, md: 0 },
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: 'bold',
            color: theme.palette.primary.main,
            fontSize: { xs: '2rem', md: '3rem' },
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          Get Started with Your Resume
        </Typography>
        <Typography
          sx={{
            mt: 2,
            fontSize: { xs: '1rem', md: '1.25rem' },
            textAlign: { xs: 'center', md: 'left' },
            color: theme.palette.text.secondary,
          }}
        >
          Choose from a variety of fixed, professional templates and let our
          AI-powered resume builder help you create a standout resume in
          minutes. Customize your details, optimize for the job you want, and
          let AI take care of the formatting and suggestions to make your resume
          shine.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{
            mt: 3,
            fontSize: '1rem',
            padding: '10px 20px',
            borderRadius: '50px',
            boxShadow: 3,
            width: { xs: '100%', md: 'auto' },
          }}
          onClick={handleGetStartedClick}
        >
          Start Building
        </Button>
      </Box>

      {/* Right Side - Image of Sample Template */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Paper
          sx={{
            width: '80%',
            maxWidth: 500,
            borderRadius: '10px',
            boxShadow: 3,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <img
            src="\assets\images\resume template.jpg"
            alt="Resume Template"
            style={{
              width: '100%',
              height: 'auto',
              objectFit: 'cover',
            }}
          />
        </Paper>
      </Box>
    </Box>
  );
};

export default ResumeHome;
