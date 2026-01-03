import React, { useState } from 'react';
import { marketingData } from '../../../dataconfig';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Fade,
} from '@mui/material';
import { useAuth } from 'src/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { ArrowForward } from '@mui/icons-material';
import CustomToast from 'src/components/atoms/Toast/CustomToast';
import EnquiryForm from 'src/components/organisms/Forms/EnquiryForm';
import '../Home.css';

export const Ams = () => {
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGoToEditor = () => {
    if (user) {
      navigate('/video-editor');
    } else {
      navigate('/login', { state: { from: '/video-editor' } });
    }
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
                Anddhen Marketing Services
              </Typography>
              <Box className="modern-divider" sx={{ mx: 'auto', mb: 4 }} />
            </Box>
          </Fade>

          {/* Video Editor CTA */}
          <Fade in timeout={1000}>
            <Box
              sx={{
                mb: 5,
                p: { xs: 2.5, md: 3 },
                background: 'linear-gradient(135deg, #fffbe6 0%, #fff9d9 100%)',
                borderRadius: '16px',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                border: '2px solid rgba(255, 193, 7, 0.3)',
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  color: '#1a1a1a',
                  mb: 1.5,
                  fontSize: { xs: '1.25rem', md: '1.5rem' },
                }}
              >
                Introducing the Anddhen Video Editing Tool
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mb: 2.5,
                  color: '#4a5568',
                  fontSize: { xs: '0.95rem', md: '1rem' },
                  lineHeight: 1.7,
                }}
              >
                Our all-in-one video editing platform lets you edit, trim, and enhance your videos,
                generate AI-powered content, and manage your digital marketing assets—all in one
                place. Click below to get started!
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                  onClick={handleGoToEditor}
                  variant="contained"
                  endIcon={<ArrowForward />}
                  sx={{
                    px: 3.5,
                    py: 1.25,
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    borderRadius: '10px',
                    bgcolor: '#ffc107',
                    color: '#1a1a1a',
                    '&:hover': {
                      bgcolor: '#ffb300',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 8px 25px rgba(255, 193, 7, 0.4)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Go to Video Editing Tool
                </Button>
              </Box>
            </Box>
          </Fade>

          {/* Description Section */}
          <Grid container spacing={4} alignItems="center" sx={{ mb: 8 }}>
            <Grid item xs={12} md={6}>
              <Fade in timeout={1200}>
                <Typography
                  variant="body1"
                  sx={{
                    lineHeight: 1.9,
                    fontSize: { xs: '1rem', md: '1.125rem' },
                    textAlign: 'justify',
                    color: '#4a5568',
                  }}
                >
                  Anddhen Marketing Services is your one-stop solution for all your digital
                  marketing needs. We specialize in managing social media accounts, ensuring your
                  brand stays active, engaging, and relevant. Our team of experts handles photo and
                  video editing, transforming your raw content into polished, professional
                  masterpieces that captivate your audience and drive engagement.
                </Typography>
              </Fade>
            </Grid>
            <Grid item xs={12} md={6}>
              <Fade in timeout={1400}>
                <Box
                  component="img"
                  src="/assets/images/marketingHome.png"
                  alt="Anddhen Marketing Services"
                  sx={{
                    width: '100%',
                    borderRadius: '24px',
                    boxShadow: '0 15px 50px rgba(0, 0, 0, 0.15)',
                  }}
                />
              </Fade>
            </Grid>
          </Grid>
        </Container>
      </section>

      {/* Our Works Section */}
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
              Our Works
            </Typography>
            <Box className="modern-divider" />
          </Box>

          <Grid container spacing={4}>
            {marketingData.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <Fade in timeout={600 + index * 100}>
                  <Card
                    className="subsidiary-card-modern"
                    sx={{
                      height: '100%',
                      borderRadius: '16px',
                      position: 'relative',
                      overflow: 'visible',
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box display="flex" alignItems="center" sx={{ mb: 1.5 }}>
                        <Box
                          className="subsidiary-icon-badge"
                          sx={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '12px',
                            bgcolor: '#ffc107',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mr: 2,
                            flexShrink: 0,
                          }}
                        >
                          <CardMedia
                            component="img"
                            image={item.logo}
                            alt={item.heading}
                            sx={{
                              width: 32,
                              height: 32,
                              objectFit: 'contain',
                            }}
                          />
                        </Box>
                        <Typography
                          variant="h6"
                          sx={{
                            fontSize: '1.15rem',
                            fontWeight: 600,
                            color: '#1a1a1a',
                            lineHeight: 1.2,
                          }}
                        >
                          {item.heading}
                        </Typography>
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#666',
                          lineHeight: 1.6,
                          fontSize: { xs: '0.9rem', md: '0.95rem' },
                        }}
                      >
                        {item.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Container>
      </section>

      {/* Contact Form Section */}
      <section className="hero-intro-section">
        <Container maxWidth="lg">
          <EnquiryForm
            title="AMS: Anddhen Marketing Services"
            setShowToast={setShowToast}
            setToastMsg={setToastMsg}
          />
          <CustomToast showToast={showToast} setShowToast={setShowToast} toastMsg={toastMsg} />
        </Container>
      </section>
    </div>
  );
};
