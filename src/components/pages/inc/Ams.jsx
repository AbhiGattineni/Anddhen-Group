import React, { useState } from 'react';
import { marketingData } from '../../../dataconfig';
import { Card, CardContent, Typography, Grid, CardMedia, Box } from '@mui/material';

import CustomToast from 'src/components/atoms/Toast/CustomToast';
import EnquiryForm from 'src/components/organisms/Forms/EnquiryForm';
export const Ams = () => {
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  return (
    <div>
      <div className="container">
        <h1
          className="main-heading"
          style={{
            marginTop: '20px',
          }}
        >
          Anddhen Marketing Services
        </h1>
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
                Anddhen Marketing Services is your one-stop solution for all your digital marketing
                needs. We specialize in managing social media accounts, ensuring your brand stays
                active, engaging, and relevant. Our team of experts handles photo and video editing,
                transforming your raw content into polished, professional masterpieces. We also
                excel in content creation, crafting visually stunning images and videos that
                resonate with your audience. With our strategic posting services, we ensure your
                content goes live at the perfect time to maximize reach and engagement.
                Additionally, we optimize your posts with carefully selected hashtags to boost
                visibility and attract the right audience. At Anddhen Marketing Services, we combine
                creativity and strategy to help your brand shine in the digital world. Let us take
                your social media presence to the next level!
              </Typography>
            </Grid>

            {/* Image on the Right */}
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="/assets/images/marketingHome.png" // Replace with your image path
                alt="Anddhen Marketing Services"
                sx={{
                  width: '100%',
                }}
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
                  boxShadow: '0px 20px 50px rgba(0, 0, 0, 0.3)', // Adds shadow
                  borderRadius: '40px 0 40px 0', // Two sharp edges, two rounded edges
                  transition: 'background-color 0.3s ease-in-out, transform 0.3s ease-in-out', // Smooth transition
                  '&:hover': {
                    backgroundColor: '#ffc107', // Yellow background on hover
                    transform: 'scale(1.05)', // Scales up on hover
                    '& .icon-container': {
                      backgroundColor: 'white', // White background for icon on hover
                    },
                  },
                }}
              >
                <CardContent>
                  {/* Flex container for icon and heading */}
                  <Box display="flex" alignItems="center">
                    {/* Rounded icon with background color */}
                    <Box
                      className="icon-container" // Class for targeting icon container
                      sx={{
                        backgroundColor: '#ffc107', // Default background color
                        borderRadius: '50%', // Makes it round
                        padding: '8px', // Adds space around the icon
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 2, // Space between icon and heading
                        transition: 'background-color 0.3s ease-in-out', // Smooth transition
                      }}
                    >
                      <CardMedia
                        component="img"
                        image={item.logo}
                        alt={item.heading}
                        sx={{
                          width: 50, // Adjust size as needed
                          height: 50, // Adjust size as needed
                          borderRadius: '50%', // Ensures the image is round
                          objectFit: 'contain', // Ensures the image is fully visible
                        }}
                      />
                    </Box>
                    {/* Heading */}
                    <Typography
                      variant="h3"
                      component="div"
                      sx={{
                        fontSize: '1.3rem', // Adjust font size
                        lineHeight: '1.2', // Ensures two lines
                        height: 50, // Matches icon height
                        display: 'flex',
                        alignItems: 'center',
                        fontWeight: 'bold', // Makes the heading bold
                      }}
                    >
                      {item.heading}
                    </Typography>
                  </Box>
                  {/* Description */}
                  <Typography
                    variant="body1" // Changed from body2 to body1 for larger text
                    sx={{
                      marginTop: 2,
                      fontSize: '1rem', // Increase description font size
                      lineHeight: '1.6', // Increase space between lines
                      textAlign: 'justify', // Justify alignment
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
    </div>
  );
};
