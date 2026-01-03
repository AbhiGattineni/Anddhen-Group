import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { Link } from 'react-router-dom';
import { acsCards } from '../../../dataconfig';
import CollegeWhatsappLinks from 'src/components/organisms/CollegeWhatsappLinks';
import { Helmet } from 'react-helmet-async';
import { Container, Box, Typography, Grid, Card, CardContent, Fade } from '@mui/material';
import { Email, Phone, WhatsApp } from '@mui/icons-material';
import '../Home.css';

export const Acs = () => {
  return (
    <>
      <Helmet>
        <title>WhatsApp Groups for US Spring/Fall 2025 | Anddhen Group</title>
        <meta
          name="description"
          content="WhatsApp groups links according to the US university 2024-25"
        />
        <meta
          name="keywords"
          content="WhatsApp group links, MS in US 2025, WhatsApp groups for students, Spring 2025, Fall 2025, Study in USA"
        />
        <link rel="canonical" href="/acs" />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'How do I join WhatsApp groups for MS in US 2025?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: "Click on the WhatsApp group link and tap 'Join Chat' to become a member.",
                },
              },
              {
                '@type': 'Question',
                name: 'Are these WhatsApp groups official?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'No, these groups are created by students to share information and help each other.',
                },
              },
            ],
          })}
        </script>
      </Helmet>

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
                  Anddhen Consulting Services
                </Typography>
                <Box className="modern-divider" sx={{ mx: 'auto', mb: 3.5 }} />
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: { xs: '0.95rem', md: '1.1rem' },
                    color: '#666',
                    lineHeight: 1.7,
                    maxWidth: '800px',
                    mx: 'auto',
                  }}
                >
                  Welcome to Anddhen Consulting Services, the emerging leader in next-gen business
                  solutions. As a startup, we understand the nuances and agility required in
                  today&apos;s fast-paced world.
                </Typography>
              </Box>
            </Fade>

            {/* Services Cards */}
            <Grid container spacing={4}>
              {acsCards.map((data, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Fade in timeout={600 + index * 100}>
                    <Card
                      component={Link}
                      to={data.path}
                      className="subsidiary-card-modern"
                      sx={{
                        height: '100%',
                        borderRadius: '16px',
                        position: 'relative',
                        overflow: 'hidden',
                        textDecoration: 'none',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <Box
                        sx={{
                          height: '180px',
                          overflow: 'hidden',
                          position: 'relative',
                          borderRadius: '16px 16px 0 0',
                        }}
                      >
                        <LazyLoadImage
                          effect="blur"
                          src={data.image}
                          alt={`${data.heading} image`}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                        <Box className="subsidiary-overlay" />
                      </Box>
                      <CardContent
                        sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            color: '#1a1a1a',
                            mb: 1.5,
                            fontSize: '1.25rem',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              color: '#3b82f6',
                            },
                          }}
                        >
                          {data.heading}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#666',
                            lineHeight: 1.6,
                            fontSize: { xs: '0.9rem', md: '0.95rem' },
                          }}
                        >
                          {data.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Fade>
                </Grid>
              ))}
            </Grid>
          </Container>
        </section>

        {/* WhatsApp Groups Section */}
        <section className="subsidiaries-section">
          <Container maxWidth="lg">
            <Box className="section-header-modern" sx={{ textAlign: 'center', mb: 6 }}>
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' },
                  fontWeight: 700,
                  color: '#1a1a1a',
                  mb: 2,
                  letterSpacing: '-0.03em',
                }}
              >
                WhatsApp Groups for US Universities (2024-25)
              </Typography>
              <Box className="modern-divider" />
            </Box>
            <Box sx={{ mb: 8 }}>
              <CollegeWhatsappLinks />
            </Box>
          </Container>
        </section>

        {/* Contact Section */}
        <section className="company-story-section">
          <Container maxWidth="lg">
            <Box className="section-header-modern" sx={{ textAlign: 'center', mb: 6 }}>
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' },
                  fontWeight: 700,
                  color: '#ffffff',
                  mb: 2,
                  letterSpacing: '-0.03em',
                }}
              >
                Contact Us
              </Typography>
              <Box className="modern-divider" />
            </Box>
            <Grid container spacing={4} justifyContent="center">
              <Grid item xs={12} sm={6} md={4}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    p: 2.5,
                    borderRadius: '16px',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <Email sx={{ fontSize: '2rem', color: '#3b82f6', mb: 1.5 }} />
                  <Typography
                    variant="body1"
                    component="a"
                    href="mailto:anddhenconsulting@gmail.com"
                    sx={{
                      color: '#ffffff',
                      textDecoration: 'none',
                      fontWeight: 600,
                      fontSize: { xs: '0.95rem', md: '1rem' },
                      '&:hover': {
                        color: '#3b82f6',
                      },
                    }}
                  >
                    anddhenconsulting@gmail.com
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    p: 2.5,
                    borderRadius: '16px',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <Phone sx={{ fontSize: '2rem', color: '#3b82f6', mb: 1.5 }} />
                  <Typography
                    variant="body1"
                    sx={{
                      color: '#ffffff',
                      fontWeight: 600,
                      fontSize: { xs: '0.95rem', md: '1rem' },
                    }}
                  >
                    +91 9110736115
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Box
                  component="a"
                  href="https://wa.me/919110736115"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    p: 2.5,
                    borderRadius: '16px',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    textDecoration: 'none',
                  }}
                >
                  <WhatsApp sx={{ fontSize: '2rem', color: '#25D366', mb: 1.5 }} />
                  <Typography
                    variant="body1"
                    sx={{
                      color: '#ffffff',
                      fontWeight: 600,
                      fontSize: { xs: '0.95rem', md: '1rem' },
                      '&:hover': {
                        color: '#25D366',
                      },
                    }}
                  >
                    +91 9110736115
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </section>
      </div>
    </>
  );
};
