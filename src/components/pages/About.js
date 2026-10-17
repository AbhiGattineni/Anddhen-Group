import React from 'react';
import { Container, Box, Typography, Grid, Card, Fade } from '@mui/material';
import { EmojiEvents, Business, Favorite, Groups } from '@mui/icons-material';
import { BRAND_NAME, TAGLINE } from '../../config/brand';
import './Home.css';

function About() {
  const values = [
    {
      title: 'Innovation',
      description:
        'We strive to lead with creativity, continually seeking new and better ways to serve our community.',
      icon: <EmojiEvents />,
    },
    {
      title: 'Inclusion',
      description:
        'We embrace diversity and foster an environment where everyone feels valued and respected.',
      icon: <Groups />,
    },
    {
      title: 'Responsibility',
      description:
        'We aim to make a positive impact on society, taking conscious steps to be sustainable and ethical in our practices.',
      icon: <Favorite />,
    },
    {
      title: 'Collaboration',
      description:
        'We believe in the power of building strong partnerships, working together to achieve common goals and drive success.',
      icon: <Business />,
    },
  ];

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
                About Us
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontSize: { xs: '1.05rem', md: '1.35rem' },
                  fontWeight: 600,
                  letterSpacing: '0.01em',
                }}
              >
                <span className="gradient-accent">
                  {BRAND_NAME}, {TAGLINE}.
                </span>
              </Typography>
            </Box>
          </Fade>

          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12}>
              <Fade in timeout={1000}>
                <Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontSize: { xs: '1.25rem', md: '1.5rem' },
                      fontWeight: 600,
                      color: '#1a1a1a',
                      mb: 2.5,
                      textAlign: 'center',
                    }}
                  >
                    Our Company
                  </Typography>
                  <Box className="modern-divider" sx={{ mb: 4 }} />
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: { xs: '1rem', md: '1.125rem' },
                      lineHeight: 1.9,
                      color: '#4a5568',
                      mb: 3,
                      textAlign: 'justify',
                    }}
                  >
                    Anddhen is a startup company that offers leading consultancy and implementation
                    expertise to help drive value across your business. We can deliver both
                    out-of-the-box and proprietary solutions and be a trustworthy, long-term
                    technology partner that aligns with your goals and helps you achieve the results
                    you require.
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
                    Whether you require complete digital transformation, a new cloud solution, a
                    platform for gathering intelligence on markets, customers, suppliers, or
                    employees; better run sales, teams, operations, practices and processes; manage
                    customer communications; drive efficiencies; or build new solutions to meet
                    market, business and real-world requirements, Anddhen can help deliver the right
                    technological solution.
                  </Typography>
                </Box>
              </Fade>
            </Grid>
          </Grid>
        </Container>
      </section>

      {/* Vision, Mission & Values Section */}
      <section className="vmv-section">
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
                  philanthropy. We envision a world where our conglomerate not only leads in
                  providing comprehensive solutions across various sectors but also makes a
                  substantial impact on societal advancement and sustainability.
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
                  Our mission is to empower our clients and communities by delivering exceptional
                  services across software development, staffing and consulting, and marketing. We
                  are committed to fostering growth, efficiency, and success for our partners while
                  upholding our commitment to social responsibility. Through our expertise and
                  philanthropic initiatives, we strive to create opportunities that drive positive
                  change and contribute to a better future.
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
    </div>
  );
}

export default About;
