import React from 'react';
import { Container, Box, Typography, Fade } from '@mui/material';
import Services from '../../organisms/Services';
import Cards from '../../organisms/Cards';
import { AssProjectModal } from 'src/components/organisms/Modal/AssProjectModal';
import { AssTeamModal } from 'src/components/organisms/Modal/AssTeamModel';
import ImageSlider from 'src/components/organisms/ImageSlider/ImageSlider';
import { myworks } from 'src/dataconfig';
import '../Home.css';

export const Ass = () => {
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
                Anddhen Software Services
              </Typography>
              <Box className="modern-divider" sx={{ mx: 'auto', mb: 3.5 }} />
              <Typography
                variant="h6"
                sx={{
                  fontSize: { xs: '0.95rem', md: '1.1rem' },
                  color: '#666',
                  lineHeight: 1.7,
                  maxWidth: '900px',
                  mx: 'auto',
                  textAlign: 'justify',
                }}
              >
                Anddhen is a startup company that offers leading consultancy and implementation
                expertise to help drive value across your business. We can deliver both
                out-of-the-box and proprietary solutions and be a trustworthy, long-term technology
                partner that aligns with your goals and helps you achieve the results you require.
                Whether you need complete digital transformation, a new cloud solution, a platform
                for gathering intelligence on markets, customers, suppliers, or employees — Anddhen
                can help deliver the right technological solution.
              </Typography>
            </Box>
          </Fade>
        </Container>
      </section>

      {/* Services Section */}
      <Services />

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
              Our team at Anddhen has worked on a variety of projects designed to empower
              organizations. From cloud-based platforms to data visualization tools, our work
              reflects our commitment to solving real-world problems through technology.
            </Typography>
          </Box>
          <Box sx={{ mb: 8 }}>
            <ImageSlider cards={myworks} />
          </Box>
        </Container>
      </section>

      {/* Cards Section */}
      <Cards />

      {/* Modals */}
      <AssProjectModal />
      <AssTeamModal />
    </div>
  );
};
