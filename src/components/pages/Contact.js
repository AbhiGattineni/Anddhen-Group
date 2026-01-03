import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Fade,
  Alert,
  Grid,
} from '@mui/material';
import { Send } from '@mui/icons-material';
import { sendEmail } from '../templates/emailService';
import './Home.css';

function Contact() {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [toastMsg, setToastMsg] = useState('');

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.length < 3) {
      newErrors.fullName = 'Full name must be at least 3 characters';
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
    }

    if (!formData.message) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length < 5) {
      newErrors.message = 'Message is too short';
    }
    return newErrors;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await sendEmail('Contact Us Form', {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
      });
      setFormData({
        fullName: '',
        phone: '',
        email: '',
        message: '',
      });
      setToastMsg('Your message has been sent successfully!');
      setErrors({});
    } catch (error) {
      setToastMsg('Something went wrong, please try again!');
      console.error('Error:', error);
    }
  };

  const handleChange = e => {
    const { id, value } = e.target;
    setFormData(prevData => ({ ...prevData, [id]: value }));
    setErrors(prevErrors => ({ ...prevErrors, [id]: '' }));
    if (toastMsg) setToastMsg('');
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
                Contact Us
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontSize: { xs: '0.95rem', md: '1.1rem' },
                  color: '#666',
                  lineHeight: 1.7,
                  maxWidth: '700px',
                  mx: 'auto',
                }}
              >
                Get in touch with us. We&apos;d love to hear from you and answer any questions you
                may have.
              </Typography>
            </Box>
          </Fade>

          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={8} lg={6}>
              <Fade in timeout={1000}>
                <Card
                  className="cta-card-modern"
                  sx={{
                    p: { xs: 2.5, md: 3.5 },
                    borderRadius: '16px',
                    boxShadow: '0 25px 80px rgba(0, 0, 0, 0.15)',
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 600,
                        color: '#1a1a1a',
                        mb: 3,
                        textAlign: 'center',
                        fontSize: { xs: '1.35rem', md: '1.5rem' },
                      }}
                    >
                      Send us a Message
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit}>
                      <TextField
                        fullWidth
                        id="fullName"
                        label="Full Name"
                        variant="outlined"
                        value={formData.fullName}
                        onChange={handleChange}
                        error={!!errors.fullName}
                        helperText={errors.fullName}
                        sx={{ mb: 2.5 }}
                        InputProps={{
                          sx: {
                            borderRadius: '10px',
                            fontSize: '0.95rem',
                          },
                        }}
                      />
                      <TextField
                        fullWidth
                        id="phone"
                        label="Phone Number"
                        variant="outlined"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        error={!!errors.phone}
                        helperText={errors.phone}
                        sx={{ mb: 2.5 }}
                        InputProps={{
                          sx: {
                            borderRadius: '10px',
                            fontSize: '0.95rem',
                          },
                        }}
                      />
                      <TextField
                        fullWidth
                        id="email"
                        label="Email Address"
                        variant="outlined"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={!!errors.email}
                        helperText={errors.email}
                        sx={{ mb: 2.5 }}
                        InputProps={{
                          sx: {
                            borderRadius: '10px',
                            fontSize: '0.95rem',
                          },
                        }}
                      />
                      <TextField
                        fullWidth
                        id="message"
                        label="Message"
                        variant="outlined"
                        multiline
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        error={!!errors.message}
                        helperText={errors.message}
                        sx={{ mb: 2.5 }}
                        InputProps={{
                          sx: {
                            borderRadius: '10px',
                            fontSize: '0.95rem',
                          },
                        }}
                      />
                      {toastMsg && (
                        <Alert
                          severity={toastMsg.includes('success') ? 'success' : 'error'}
                          sx={{ mb: 3, borderRadius: '12px' }}
                        >
                          {toastMsg}
                        </Alert>
                      )}
                      <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        endIcon={<Send />}
                        className="primary-cta-btn"
                        sx={{
                          py: 1.25,
                          fontSize: '0.95rem',
                          fontWeight: 600,
                          textTransform: 'none',
                          borderRadius: '10px',
                          mt: 2,
                        }}
                      >
                        Send Message
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          </Grid>
        </Container>
      </section>
    </div>
  );
}

export default Contact;
