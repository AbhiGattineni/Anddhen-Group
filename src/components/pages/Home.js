import React from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Fade,
  Chip,
  Stack,
} from '@mui/material';
import {
  ArrowForward,
  Business,
  Code,
  Campaign,
  Favorite,
  Flight,
  AccountBalance,
  CheckCircle,
  Groups,
  EmojiEvents,
} from '@mui/icons-material';
import Slider from '../organisms/Slider';
import { subsidiaries } from '../../dataconfig';
import './Home.css';

const Home = () => {
  const subsidiaryIcons = {
    'Anddhen Marketing Services': <Campaign />,
    'Anddhen Consulting Services': <Business />,
    'Anddhen Software Services': <Code />,
    'Anddhen Philanthropy Services': <Favorite />,
    // 'Anddhen Trading & Investment': <TrendingUp />,
    'Andhden Travel Services': <Flight />,
    'Anddhen NRI Services': <AccountBalance />,
  };

  const stats = [
    { number: '6', label: 'Specialized Divisions', icon: <Business /> },
    { number: '100+', label: 'Projects Delivered', icon: <CheckCircle /> },
  ];

  const values = [
    {
      title: 'Innovation',
      description: 'Leading with creativity and seeking better ways to serve our community.',
      icon: <EmojiEvents />,
    },
    {
      title: 'Inclusion',
      description: 'Embracing diversity and fostering an environment where everyone feels valued.',
      icon: <Groups />,
    },
    {
      title: 'Responsibility',
      description: 'Making a positive impact through sustainable and ethical practices.',
      icon: <Favorite />,
    },
    {
      title: 'Collaboration',
      description: 'Building strong partnerships to achieve common goals and drive success.',
      icon: <Business />,
    },
  ];

  return (
    <div className="home-page">
      {/* Slider Section at Top */}
      <section className="slider-section">
        <Slider />
      </section>

      {/* Hero Introduction Section */}
      <section className="hero-intro-section">
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Fade in timeout={800}>
                <Box className="hero-intro-content">
                  <Chip
                    label="Diversified Conglomerate"
                    sx={{
                      mb: 2.5,
                      px: 2,
                      py: 2.5,
                      fontSize: { xs: '0.85rem', md: '0.9rem' },
                      fontWeight: 600,
                      bgcolor: '#3b82f6',
                      color: 'white',
                      '&:hover': { bgcolor: '#6366f1' },
                    }}
                  />
                  <Typography
                    variant="h1"
                    sx={{
                      fontSize: { xs: '2rem', sm: '2.75rem', md: '3.25rem' },
                      fontWeight: 700,
                      lineHeight: 1.1,
                      mb: 2.5,
                      color: '#ffffff',
                      letterSpacing: '-0.03em',
                    }}
                  >
                    More Than a Business—
                    <br />
                    <span className="gradient-accent">A Conglomerate with Purpose</span>
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: { xs: '0.95rem', md: '1.1rem' },
                      color: '#666',
                      lineHeight: 1.7,
                      mb: 3.5,
                      maxWidth: '90%',
                    }}
                  >
                    Deeply invested in India&apos;s dynamic market and beyond, we deliver bespoke
                    solutions across software, consulting, and marketing while making a difference
                    through philanthropy.
                    {/* solutions across software, consulting, investment, and marketing while making a */}
                  </Typography>
                  <Stack direction="row" spacing={2} flexWrap="wrap">
                    <Button
                      component={Link}
                      to="/about"
                      variant="contained"
                      endIcon={<ArrowForward />}
                      className="primary-cta-btn"
                      sx={{
                        px: 3.5,
                        py: 1.25,
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        textTransform: 'none',
                        borderRadius: '10px',
                      }}
                    >
                      Discover Our Story
                    </Button>
                    <Button
                      component={Link}
                      to="/contact"
                      variant="outlined"
                      className="secondary-cta-btn"
                      sx={{
                        px: 3.5,
                        py: 1.25,
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        textTransform: 'none',
                        borderRadius: '10px',
                        borderWidth: '2px',
                      }}
                    >
                      Get in Touch
                    </Button>
                  </Stack>
                </Box>
              </Fade>
            </Grid>
            <Grid item xs={12} md={6}>
              <Fade in timeout={1000}>
                <Box className="stats-grid">
                  {stats.map((stat, index) => (
                    <Card
                      key={index}
                      className="stat-card"
                      sx={{
                        p: 3,
                        textAlign: 'center',
                        borderRadius: '16px',
                      }}
                    >
                      <Box
                        sx={{
                          fontSize: '2.5rem',
                          color: '#3b82f6',
                          mb: 1.5,
                        }}
                      >
                        {stat.icon}
                      </Box>
                      <Typography
                        variant="h2"
                        sx={{
                          fontWeight: 700,
                          color: '#1a1a1a',
                          mb: 1,
                          fontSize: { xs: '2rem', md: '2.5rem' },
                        }}
                      >
                        {stat.number}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: '#4a5568',
                          fontWeight: 600,
                          fontSize: { xs: '0.9rem', md: '0.95rem' },
                        }}
                      >
                        {stat.label}
                      </Typography>
                    </Card>
                  ))}
                </Box>
              </Fade>
            </Grid>
          </Grid>
        </Container>
      </section>

      {/* Company Story Section - Asymmetric Design */}
      <section className="company-story-section">
        <Container maxWidth="lg">
          <Grid container spacing={6}>
            <Grid item xs={12} md={5}>
              <Box className="story-visual">
                <Box className="story-card-main">
                  <Typography
                    variant="h2"
                    sx={{
                      fontSize: { xs: '1.75rem', md: '2.5rem' },
                      fontWeight: 700,
                      color: '#ffffff',
                      mb: 2,
                      lineHeight: 1.2,
                      textShadow: '0 2px 20px rgba(0, 0, 0, 0.5)',
                    }}
                  >
                    Our Story
                  </Typography>
                  <Box className="story-divider" />
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={7}>
              <Box className="story-content">
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: { xs: '1rem', md: '1.1rem' },
                    lineHeight: 1.8,
                    color: 'rgba(255, 255, 255, 0.85)',
                    mb: 2.5,
                  }}
                >
                  At Anddhen, we pride ourselves on being more than just a business—we are a
                  conglomerate with a heart. Our diverse portfolio spans software development,
                  staffing and consulting, and comprehensive marketing services.
                  {/* staffing and consulting, trading and investment, and comprehensive marketing */}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: { xs: '1rem', md: '1.1rem' },
                    lineHeight: 1.8,
                    color: 'rgba(255, 255, 255, 0.85)',
                    mb: 2.5,
                  }}
                >
                  We deliver bespoke solutions tailored to your unique needs while making a
                  difference through our philanthropic endeavors, contributing to community
                  betterment and sustainable development.
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: { xs: '1rem', md: '1.1rem' },
                    lineHeight: 1.8,
                    color: '#ffffff',
                    fontWeight: 600,
                    fontStyle: 'italic',
                    mb: 3.5,
                  }}
                >
                  &quot;Choose Anddhen, where our services meet your ambition, and together we
                  create not just success, but a legacy of positive impact.&quot;
                </Typography>
                <Button
                  component={Link}
                  to="/about"
                  variant="outlined"
                  endIcon={<ArrowForward />}
                  sx={{
                    px: 3.5,
                    py: 1.25,
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    borderRadius: '10px',
                    borderWidth: '2px',
                    borderColor: '#3b82f6',
                    color: '#3b82f6',
                    '&:hover': {
                      borderWidth: '2px',
                      bgcolor: '#3b82f6',
                      color: 'white',
                    },
                  }}
                >
                  Read More
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </section>

      {/* Subsidiaries Section - Unique Card Design */}
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
              Our Subsidiaries
            </Typography>
            <Box className="modern-divider" />
            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: '1rem', md: '1.1rem' },
                color: '#666',
                mt: 2.5,
                maxWidth: '700px',
                mx: 'auto',
                fontWeight: 400,
              }}
            >
              Six specialized divisions, one unified vision for excellence
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {subsidiaries
              .filter(subsidiary => subsidiary.Name !== 'Anddhen Trading & Investment')
              .map((subsidiary, index) => (
                <Grid item xs={12} sm={6} md={4} key={subsidiary.Name}>
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
                      <Box
                        className="subsidiary-image-container"
                        sx={{
                          height: '180px',
                          overflow: 'hidden',
                          position: 'relative',
                          borderRadius: '16px 16px 0 0',
                        }}
                      >
                        <img
                          src={subsidiary.Photo}
                          alt={subsidiary.Name}
                          className="subsidiary-image"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                        <Box className="subsidiary-overlay" />
                        <Box
                          className="subsidiary-icon-badge"
                          sx={{
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            width: '50px',
                            height: '50px',
                            borderRadius: '12px',
                            bgcolor: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#3b82f6',
                            fontSize: '1.5rem',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                            transition: 'all 0.4s ease',
                          }}
                        >
                          {subsidiaryIcons[subsidiary.Name] || <Business />}
                        </Box>
                      </Box>
                      <CardContent
                        sx={{
                          p: 3,
                          position: 'relative',
                          bgcolor: 'white',
                        }}
                      >
                        <Typography
                          variant="h6"
                          component={Link}
                          to={subsidiary.link}
                          sx={{
                            fontWeight: 600,
                            color: '#1a1a1a',
                            textDecoration: 'none',
                            mb: 1.5,
                            display: 'block',
                            fontSize: '1.25rem',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              color: '#3b82f6',
                              transform: 'translateX(5px)',
                            },
                          }}
                        >
                          {subsidiary.Name}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#666',
                            lineHeight: 1.6,
                            mb: 2.5,
                            minHeight: '50px',
                            fontSize: { xs: '0.9rem', md: '0.95rem' },
                          }}
                        >
                          {subsidiary.Description}
                        </Typography>
                        <Button
                          component={Link}
                          to={subsidiary.link}
                          variant="text"
                          endIcon={<ArrowForward />}
                          className="subsidiary-link-btn"
                          sx={{
                            color: '#3b82f6',
                            fontWeight: 600,
                            textTransform: 'none',
                            px: 0,
                            fontSize: { xs: '0.9rem', md: '0.95rem' },
                            '&:hover': {
                              bgcolor: 'transparent',
                              color: '#6366f1',
                              transform: 'translateX(5px)',
                            },
                            transition: 'all 0.3s ease',
                          }}
                        >
                          Explore Service
                        </Button>
                      </CardContent>
                    </Card>
                  </Fade>
                </Grid>
              ))}
          </Grid>
        </Container>
      </section>

      {/* Vision, Mission & Values - Interactive Design */}
      <section className="vmv-section">
        <Container maxWidth="lg">
          <Box className="section-header-modern" sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2rem', sm: '2.5rem', md: '2.75rem' },
                fontWeight: 700,
                color: '#ffffff',
                mb: 2,
                letterSpacing: '-0.03em',
                textShadow: '0 2px 30px rgba(59, 130, 246, 0.5)',
              }}
            >
              Vision, Mission & Values
            </Typography>
            <Box className="modern-divider" />
          </Box>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Card
                className="vmv-card-modern vision-card"
                sx={{
                  height: '100%',
                  p: 3,
                  borderRadius: '16px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    fontSize: '2.5rem',
                    color: '#3b82f6',
                    mb: 1.5,
                  }}
                >
                  <EmojiEvents />
                </Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    color: '#1a1a1a',
                    mb: 1.5,
                    fontSize: '1.35rem',
                  }}
                >
                  Our Vision
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: '#4a5568',
                    lineHeight: 1.7,
                    fontSize: { xs: '0.95rem', md: '1rem' },
                  }}
                >
                  To be a beacon of innovation and integrity in the global marketplace, transforming
                  businesses and communities through cutting-edge technology and dedicated
                  philanthropy.
                  {/* businesses and communities through cutting-edge technology, strategic investment, */}
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card
                className="vmv-card-modern mission-card"
                sx={{
                  height: '100%',
                  p: 3,
                  borderRadius: '16px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    fontSize: '2.5rem',
                    color: '#3b82f6',
                    mb: 1.5,
                  }}
                >
                  <Business />
                </Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    color: '#1a1a1a',
                    mb: 1.5,
                    fontSize: '1.35rem',
                  }}
                >
                  Our Mission
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: '#4a5568',
                    lineHeight: 1.7,
                    fontSize: { xs: '0.95rem', md: '1rem' },
                  }}
                >
                  To empower clients and communities by delivering exceptional services across
                  software development, staffing and consulting, and marketing while upholding our
                  commitment to social responsibility.
                  {/* software development, staffing and consulting, trading and investment, and */}
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card
                className="vmv-card-modern values-card"
                sx={{
                  height: '100%',
                  p: 3,
                  borderRadius: '16px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    fontSize: '2.5rem',
                    color: '#3b82f6',
                    mb: 1.5,
                  }}
                >
                  <Favorite />
                </Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    color: '#1a1a1a',
                    mb: 1.5,
                    fontSize: '1.35rem',
                  }}
                >
                  Our Values
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {values.map((value, index) => (
                    <Box key={index} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                      <Box
                        sx={{
                          color: '#3b82f6',
                          mt: 0.5,
                          fontSize: '1rem',
                        }}
                      >
                        {value.icon}
                      </Box>
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            color: '#1a1a1a',
                            mb: 0.5,
                            fontSize: '0.9rem',
                          }}
                        >
                          {value.title}:
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#4a5568',
                            lineHeight: 1.6,
                            fontSize: '0.85rem',
                          }}
                        >
                          {value.description}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </section>

      {/* WhatsApp Groups CTA Section */}
      <section className="cta-section-modern">
        <Container maxWidth="md">
          <Card
            className="cta-card-modern"
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: '16px',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: '#1a1a1a',
                mb: 2,
                fontSize: { xs: '1.5rem', md: '1.75rem' },
              }}
            >
              Join WhatsApp Groups for US Universities (2024-25)
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#666',
                mb: 3.5,
                fontSize: { xs: '1rem', md: '1.05rem' },
                lineHeight: 1.7,
                maxWidth: '600px',
                mx: 'auto',
              }}
            >
              Connect with fellow students, get important updates, and discuss admissions for the
              2024-25 intake. Our WhatsApp groups help students stay informed and make better
              decisions.
            </Typography>
            <Button
              component={Link}
              to="/acs"
              variant="contained"
              startIcon={
                <Box component="span" sx={{ fontSize: '1.25rem' }}>
                  💬
                </Box>
              }
              sx={{
                px: 4,
                py: 1.25,
                fontSize: '0.95rem',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: '10px',
                bgcolor: '#25D366',
                '&:hover': {
                  bgcolor: '#20BA5A',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 8px 25px rgba(37, 211, 102, 0.4)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              View Groups
            </Button>
          </Card>
        </Container>
      </section>
    </div>
  );
};

export default Home;
