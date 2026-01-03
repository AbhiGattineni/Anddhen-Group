import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Fade,
} from '@mui/material';
import { Send } from '@mui/icons-material';
import PropTypes from 'prop-types';
import { sendEmail } from '../../templates/emailService';

const EnquiryForm = ({ title, setShowToast, setToastMsg }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    countryCode: '+1',
    phone: '',
    message: '',
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
    }
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.message) newErrors.message = 'Message is required';
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
      sendEmail(title, {
        subsidary: title,
        name: formData.name,
        email: formData.email,
        phone: `${formData.countryCode} ${formData.phone}`,
        message: formData.message,
      });
      setFormData({
        name: '',
        email: '',
        countryCode: '+1',
        phone: '',
        message: '',
      });
      setErrors({});
      setToastMsg('Data successfully submitted!');
      setShowToast(true);
    } catch (error) {
      setToastMsg('Something went wrong!');
      setShowToast(true);
      console.error('Error:', error);
    }
  };

  const handleChange = e => {
    const { id, value } = e.target;
    setFormData(prevData => ({ ...prevData, [id]: value }));
    setErrors(prevErrors => ({ ...prevErrors, [id]: '' }));
  };

  return (
    <Container maxWidth="sm">
      <Fade in timeout={800}>
        <Card
          sx={{
            p: { xs: 2.5, md: 3 },
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            bgcolor: '#ffffff',
            border: '1px solid rgba(0, 0, 0, 0.05)',
          }}
        >
          <CardContent sx={{ p: 0 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: '#1a1a1a',
                mb: 2.5,
                textAlign: 'center',
                fontSize: { xs: '1.25rem', md: '1.5rem' },
              }}
            >
              Contact Us
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                id="name"
                label="Name"
                variant="outlined"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                sx={{
                  mb: 2.5,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: '#f8f9fa',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: '#f1f3f5',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#3b82f6',
                      },
                    },
                    '&.Mui-focused': {
                      backgroundColor: '#ffffff',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderWidth: '2px',
                        borderColor: '#3b82f6',
                      },
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#3b82f6',
                  },
                }}
              />
              <TextField
                fullWidth
                id="email"
                label="Email"
                variant="outlined"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                sx={{
                  mb: 2.5,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: '#f8f9fa',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: '#f1f3f5',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#3b82f6',
                      },
                    },
                    '&.Mui-focused': {
                      backgroundColor: '#ffffff',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderWidth: '2px',
                        borderColor: '#3b82f6',
                      },
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#3b82f6',
                  },
                }}
              />
              <Grid container spacing={2} sx={{ mb: 2.5 }}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    id="countryCode"
                    label="Code"
                    select
                    variant="outlined"
                    value={formData.countryCode}
                    onChange={handleChange}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: '#f8f9fa',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: '#f1f3f5',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#3b82f6',
                          },
                        },
                        '&.Mui-focused': {
                          backgroundColor: '#ffffff',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderWidth: '2px',
                            borderColor: '#3b82f6',
                          },
                        },
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#3b82f6',
                      },
                    }}
                  >
                    <MenuItem value="+1">+1 (USA)</MenuItem>
                    <MenuItem value="+91">+91 (India)</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={8}>
                  <TextField
                    fullWidth
                    id="phone"
                    label="Phone"
                    variant="outlined"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    error={!!errors.phone}
                    helperText={errors.phone}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: '#f8f9fa',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: '#f1f3f5',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#3b82f6',
                          },
                        },
                        '&.Mui-focused': {
                          backgroundColor: '#ffffff',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderWidth: '2px',
                            borderColor: '#3b82f6',
                          },
                        },
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#3b82f6',
                      },
                    }}
                  />
                </Grid>
              </Grid>
              <TextField
                fullWidth
                id="message"
                label="Message"
                variant="outlined"
                multiline
                rows={4}
                value={formData.message}
                onChange={handleChange}
                error={!!errors.message}
                helperText={errors.message}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: '#f8f9fa',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: '#f1f3f5',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#3b82f6',
                      },
                    },
                    '&.Mui-focused': {
                      backgroundColor: '#ffffff',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderWidth: '2px',
                        borderColor: '#3b82f6',
                      },
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#3b82f6',
                  },
                }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                  type="submit"
                  variant="contained"
                  endIcon={<Send />}
                  sx={{
                    px: 4,
                    py: 1.25,
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    borderRadius: '10px',
                    bgcolor: '#3b82f6',
                    boxShadow: '0 4px 14px rgba(59, 130, 246, 0.3)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: '#2563eb',
                      boxShadow: '0 6px 20px rgba(59, 130, 246, 0.4)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  Submit
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Fade>
    </Container>
  );
};

EnquiryForm.propTypes = {
  title: PropTypes.string.isRequired,
  setShowToast: PropTypes.func.isRequired,
  setToastMsg: PropTypes.func.isRequired,
};

export default EnquiryForm;
