import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Fade,
  IconButton,
} from '@mui/material';
import {
  LocationOn,
  Email,
  Phone,
  Edit,
  Send,
  ArrowBackIos,
  ArrowForwardIos,
} from '@mui/icons-material';
import EnquiryForm from 'src/components/organisms/Forms/EnquiryForm';
import CustomToast from 'src/components/atoms/Toast/CustomToast';
import ATSHome from './ATSHome';
import '../Home.css';

const steps = [
  {
    icon: <LocationOn />,
    title: 'Decide',
    description: 'Decide which place you want to go',
  },
  {
    icon: <Email />,
    title: 'Message',
    description: 'Message us using the form below',
  },
  {
    icon: <Phone />,
    title: 'Relax',
    description: 'We will contact you and take details while you relax',
  },
  {
    icon: <Edit />,
    title: 'Customize',
    description: 'We will come up with plans and customize',
  },
  {
    icon: <Send />,
    title: 'Start',
    description: 'Start the trip, and we will be with you throughout',
  },
];

export const Ats = () => {
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const travelImages = [
    {
      src: '/assets/images/travel1.jpg',
      alt: 'Explore New Destinations',
      title: 'Explore New Destinations',
    },
    { src: '/assets/images/travel2.jpg', alt: 'Adventure Awaits', title: 'Adventure Awaits' },
    { src: '/assets/images/atsSlider.jpg', alt: 'Relax and Enjoy', title: 'Relax and Enjoy' },
  ];

  const handleNext = () => {
    setCurrentImageIndex(prev => (prev + 1) % travelImages.length);
  };

  const handlePrevious = () => {
    setCurrentImageIndex(prev => (prev - 1 + travelImages.length) % travelImages.length);
  };

  const goToSlide = index => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-intro-section">
        <Container maxWidth="lg">
          <Fade in timeout={800}>
            <Box className="hero-intro-content" sx={{ textAlign: 'center', mb: 6 }}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2rem', sm: '2.75rem', md: '3.25rem' },
                  fontWeight: 700,
                  lineHeight: 1.1,
                  mb: 2.5,
                  color: '#1a1a1a',
                  letterSpacing: '-0.03em',
                }}
              >
                Anddhen Travel Services
              </Typography>
              <Box className="modern-divider" sx={{ mx: 'auto', mb: 4 }} />
            </Box>
          </Fade>

          {/* Image Slider */}
          <Box sx={{ position: 'relative', mb: 6, borderRadius: '24px', overflow: 'hidden' }}>
            <Box
              sx={{
                position: 'relative',
                height: '350px',
                overflow: 'hidden',
                borderRadius: '16px',
                boxShadow: '0 15px 50px rgba(0, 0, 0, 0.15)',
              }}
            >
              {travelImages.map((image, index) => (
                <Fade
                  in={currentImageIndex === index}
                  timeout={500}
                  key={index}
                  style={{
                    display: currentImageIndex === index ? 'block' : 'none',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                    }}
                  >
                    <Box
                      component="img"
                      src={image.src}
                      alt={image.alt}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                        p: 4,
                      }}
                    >
                      <Typography
                        variant="h4"
                        sx={{
                          color: '#ffffff',
                          fontWeight: 700,
                          fontSize: { xs: '1.5rem', md: '2rem' },
                        }}
                      >
                        {image.title}
                      </Typography>
                    </Box>
                  </Box>
                </Fade>
              ))}

              {/* Navigation Arrows */}
              <IconButton
                onClick={handlePrevious}
                sx={{
                  position: 'absolute',
                  left: 20,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                  color: '#1a1a1a',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 1)',
                  },
                  zIndex: 2,
                }}
              >
                <ArrowBackIos />
              </IconButton>
              <IconButton
                onClick={handleNext}
                sx={{
                  position: 'absolute',
                  right: 20,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                  color: '#1a1a1a',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 1)',
                  },
                  zIndex: 2,
                }}
              >
                <ArrowForwardIos />
              </IconButton>

              {/* Indicators */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 20,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  gap: 1,
                  zIndex: 2,
                }}
              >
                {travelImages.map((_, index) => (
                  <Box
                    key={index}
                    onClick={() => goToSlide(index)}
                    sx={{
                      width: currentImageIndex === index ? 32 : 12,
                      height: 12,
                      borderRadius: '6px',
                      bgcolor: currentImageIndex === index ? '#ffffff' : 'rgba(255, 255, 255, 0.5)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.8)',
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Box>

          {/* Description */}
          <Fade in timeout={1000}>
            <Box
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: '24px',
                bgcolor: '#f8f9fa',
                mb: 8,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: '1rem', md: '1.125rem' },
                  lineHeight: 1.9,
                  color: '#4a5568',
                  textAlign: 'justify',
                }}
              >
                If you are an individual, group, couple, or family wanting to travel for a few days
                or just over the weekend, planning everything from the travel route, places to
                visit, flights, car rentals, hotels, restaurants, sightseeing, and timings can be
                overwhelming as a working individual. We understand the hassle and stress involved
                in organizing a trip, and that&apos;s where we come to help you. Whether it&apos;s
                finding the best flight options, comfortable accommodations, arranging car rentals,
                or recommending top-notch restaurants, we take care of everything. We also provide
                detailed itineraries that include must-see attractions and hidden gems, along with
                optimal timings to visit each place. Our goal is to make your travel experience as
                smooth and enjoyable as possible, allowing you to focus on making memories rather
                than worrying about logistics.
              </Typography>
            </Box>
          </Fade>
        </Container>
      </section>

      {/* How It Works Section */}
      <section className="subsidiaries-section">
        <Container maxWidth="lg">
          <Box className="section-header-modern" sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2rem', sm: '2.5rem', md: '2.75rem' },
                fontWeight: 700,
                color: '#1a1a1a',
                mb: 2,
                letterSpacing: '-0.03em',
              }}
            >
              How It Works
            </Typography>
            <Box className="modern-divider" />
          </Box>

          <Grid container spacing={4} justifyContent="center">
            {steps.map((step, index) => (
              <Grid item xs={12} sm={6} md={2} key={index}>
                <Fade in timeout={600 + index * 100}>
                  <Card
                    className="vmv-card-modern"
                    sx={{
                      height: '100%',
                      p: 3,
                      borderRadius: '24px',
                      textAlign: 'center',
                    }}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          width: '60px',
                          height: '60px',
                          borderRadius: '50%',
                          bgcolor: '#ffc107',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mx: 'auto',
                          mb: 2,
                          color: '#1a1a1a',
                          fontSize: '1.5rem',
                        }}
                      >
                        {step.icon}
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: '#1a1a1a',
                          mb: 1,
                          fontSize: '1.25rem',
                        }}
                      >
                        {step.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#666',
                          lineHeight: 1.6,
                          fontSize: '0.95rem',
                        }}
                      >
                        {step.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Container>
      </section>

      {/* ATS Home Component */}
      <ATSHome />

      {/* Contact Form Section */}
      <section className="hero-intro-section">
        <Container maxWidth="lg">
          <EnquiryForm
            title="ATS: Anddhen Travel Services"
            setShowToast={setShowToast}
            setToastMsg={setToastMsg}
          />
          <CustomToast showToast={showToast} setShowToast={setShowToast} toastMsg={toastMsg} />
        </Container>
      </section>
    </div>
  );
};

export default Ats;
