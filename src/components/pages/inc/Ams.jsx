import React, { useState } from 'react';
import { marketingData } from '../../../dataconfig';
import { Card, CardContent, Typography, Grid, CardMedia, Box } from '@mui/material';
import { useAuth } from 'src/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

import CustomToast from 'src/components/atoms/Toast/CustomToast';
import EnquiryForm from 'src/components/organisms/Forms/EnquiryForm';

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
    <div>
      <section className="section border-top">
        <div className="container">
          <h1 className="text-center">Anddhen Marketing Services</h1>
          <div className="underline mx-auto"></div>

          {/* Introductory Section for Video Editing Tool */}
          <Box sx={{ my: 4, p: 3, background: '#fffbe6', borderRadius: 3, boxShadow: 1 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Introducing the Anddhen Video Editing Tool
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Our all-in-one video editing platform lets you edit, trim, and enhance your videos,
              generate AI-powered content, and manage your digital marketing assets—all in one
              place. Click below to get started!
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <button
                onClick={handleGoToEditor}
                style={{
                  background: '#ffc107',
                  color: '#222',
                  border: 'none',
                  borderRadius: 8,
                  padding: '12px 32px',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  transition: 'background 0.2s',
                }}
              >
                Go to Video Editing Tool
              </button>
            </Box>
          </Box>
        </div>

        <Box sx={{ padding: '20px 20px', backgroundColor: '#f9f9f9' }}>
          <div className="container">
            <Grid container spacing={4} alignItems="center">
              {/* Text on the Left */}
              <Grid item xs={12} md={6}>
                <Typography
                  variant="body1"
                  sx={{
                    lineHeight: '1.8',
                    fontSize: '1.1rem',
                    textAlign: 'justify',
                  }}
                >
                  Anddhen Marketing Services is your one-stop solution for all your digital
                  marketing needs. We specialize in managing social media accounts, ensuring your
                  brand stays active, engaging, and relevant. Our team of experts handles photo and
                  video editing, transforming your raw content into polished, professional
                  masterpieces...
                </Typography>
              </Grid>

              {/* Image on the Right */}
              <Grid item xs={12} md={6}>
                <Box
                  component="img"
                  src="/assets/images/marketingHome.png"
                  alt="Anddhen Marketing Services"
                  sx={{ width: '100%' }}
                />
              </Grid>
            </Grid>
          </div>
        </Box>

        <div className="col-md-12 mb-4 mt-4 text-center">
          <h3 className="main-heading">Our Works</h3>
          <div className="underline mx-auto"></div>
        </div>

        <div className="container">
          <Grid container spacing={4} style={{ padding: '20px' }}>
            {marketingData.map(item => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <Card
                  sx={{
                    boxShadow: '0px 20px 50px rgba(0, 0, 0, 0.3)',
                    borderRadius: '40px 0 40px 0',
                    transition: 'background-color 0.3s ease-in-out, transform 0.3s ease-in-out',
                    '&:hover': {
                      backgroundColor: '#ffc107',
                      transform: 'scale(1.05)',
                      '& .icon-container': {
                        backgroundColor: 'white',
                      },
                    },
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center">
                      <Box
                        className="icon-container"
                        sx={{
                          backgroundColor: '#ffc107',
                          borderRadius: '50%',
                          padding: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: 2,
                          transition: 'background-color 0.3s ease-in-out',
                        }}
                      >
                        <CardMedia
                          component="img"
                          image={item.logo}
                          alt={item.heading}
                          sx={{
                            width: 50,
                            height: 50,
                            borderRadius: '50%',
                            objectFit: 'contain',
                          }}
                        />
                      </Box>

                      <Typography
                        variant="h3"
                        component="div"
                        sx={{
                          fontSize: '1.3rem',
                          lineHeight: '1.2',
                          height: 50,
                          display: 'flex',
                          alignItems: 'center',
                          fontWeight: 'bold',
                        }}
                      >
                        {item.heading}
                      </Typography>
                    </Box>

                    <Typography
                      variant="body1"
                      sx={{
                        marginTop: 2,
                        fontSize: '1rem',
                        lineHeight: '1.6',
                        textAlign: 'justify',
                      }}
                    >
                      {item.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Contact Form */}
          <div className="mb-4">
            <EnquiryForm
              title="AMS: Anddhen Marketing Services"
              setShowToast={setShowToast}
              setToastMsg={setToastMsg}
            />
            <CustomToast showToast={showToast} setShowToast={setShowToast} toastMsg={toastMsg} />
          </div>
        </div>
      </section>
    </div>
  );
};
