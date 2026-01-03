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
import { Favorite, CardGiftcard, Public, ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import EnquiryForm from 'src/components/organisms/Forms/EnquiryForm';
import CustomToast from 'src/components/atoms/Toast/CustomToast';
import ShoppingPage from 'src/components/generalComponents/ShoopingPage';
import '../Home.css';

const services = [
  {
    icon: <Favorite />,
    title: 'Family Care',
    description: 'Arrange services for parents and relatives with ease.',
  },
  {
    icon: <CardGiftcard />,
    title: 'Gifts & Surprises',
    description: 'Send gifts and surprises for special occasions in India.',
  },
  {
    icon: <Public />,
    title: 'NRI Services',
    description:
      'All-in-one support for managing tasks in India, from family care to sending gifts.',
  },
];

export const Ans = () => {
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nriImages = [
    {
      src: '/assets/images/services1.jpg',
      alt: 'Your Support in India',
      title: 'Your Support in India',
    },
    {
      src: '/assets/images/services2.jpg',
      alt: 'For Your Loved Ones',
      title: 'For Your Loved Ones',
    },
    {
      src: '/assets/images/slider1.jpg',
      alt: 'Special Occasions Covered',
      title: 'Special Occasions Covered',
    },
  ];

  const handleNext = () => {
    setCurrentImageIndex(prev => (prev + 1) % nriImages.length);
  };

  const handlePrevious = () => {
    setCurrentImageIndex(prev => (prev - 1 + nriImages.length) % nriImages.length);
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
                Anddhen NRI Services
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
              {nriImages.map((image, index) => (
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
                {nriImages.map((_, index) => (
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
                  mb: 2,
                }}
              >
                At Anddhen NRI Services, we are dedicated to providing comprehensive assistance to
                NRIs who wish to stay connected with India. Whether you need to manage tasks for
                your family, send gifts on special occasions, or require assistance with any other
                needs in India, we are here to help you every step of the way. We understand the
                challenges of being far away and the desire to maintain a strong bond with your home
                country.
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: '1rem', md: '1.125rem' },
                  lineHeight: 1.9,
                  color: '#4a5568',
                  textAlign: 'justify',
                }}
              >
                Our services extend to assisting NRIs in supporting their families back home. From
                handling essential tasks for your parents and relatives to arranging timely
                deliveries for festivals and birthdays, we ensure that your presence is felt even
                when you are miles away.
              </Typography>
            </Box>
          </Fade>
        </Container>
      </section>

      {/* Our Services Section */}
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
              Our Services
            </Typography>
            <Box className="modern-divider" />
          </Box>

          <Grid container spacing={4} justifyContent="center">
            {services.map((service, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Fade in timeout={600 + index * 100}>
                  <Card
                    className="vmv-card-modern"
                    sx={{
                      height: '100%',
                      p: 4,
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
                          mb: 3,
                          color: '#1a1a1a',
                          fontSize: '2rem',
                        }}
                      >
                        {service.icon}
                      </Box>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 700,
                          color: '#1a1a1a',
                          mb: 2,
                          fontSize: '1.5rem',
                        }}
                      >
                        {service.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#666',
                          lineHeight: 1.7,
                          fontSize: '1rem',
                        }}
                      >
                        {service.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Container>
      </section>

      {/* Shopping Page Section */}
      <section className="hero-intro-section">
        <Container maxWidth="lg">
          <ShoppingPage />
        </Container>
      </section>

      {/* Contact Form Section */}
      <section className="hero-intro-section">
        <Container maxWidth="lg">
          <EnquiryForm
            title="ANS: Anddhen NRI Services"
            setShowToast={setShowToast}
            setToastMsg={setToastMsg}
          />
          <CustomToast showToast={showToast} setShowToast={setShowToast} toastMsg={toastMsg} />
        </Container>
      </section>
    </div>
  );
};

export default Ans;
