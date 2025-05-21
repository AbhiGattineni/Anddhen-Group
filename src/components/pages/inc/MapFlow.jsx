import React, { useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Modal,
  Backdrop,
  Fade,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import PropTypes from 'prop-types';
import { LocationOn } from '@mui/icons-material';
import './mapflow.css';
import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DescriptionIcon from '@mui/icons-material/Description';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import TimerIcon from '@mui/icons-material/Timer';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import SavingsIcon from '@mui/icons-material/Savings';

const MapFlow = ({ tripData }) => {
  const [open, setOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleOpen = activity => {
    setSelectedActivity(activity);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedActivity(null);
  };

  const allActivities = tripData?.days.flatMap(day => day.activities);

  return (
    <Container
      className="work-section"
      sx={{ py: 5, background: 'linear-gradient(to right, #d7e8f7, #f5d0c5)' }}
    >
      <Grid container spacing={6} direction="column" alignItems="center">
        {allActivities?.map((item, index) => (
          <Grid
            item
            key={index}
            className={`card-container ${index % 2 === 0 ? 'left' : 'right'}`}
            onClick={() => handleOpen(item)}
            style={{ cursor: 'pointer' }}
          >
            <Card
              className="work-card"
              sx={{
                position: 'relative',
                zIndex: 100,
                backgroundColor: 'transparent',
                boxShadow: 'none',
              }}
            >
              <Box
                className="image-container"
                sx={{
                  textAlign: 'center',
                  p: 2,
                  borderRadius: '50%',
                  backgroundColor: 'lightgray',
                  width: '60px',
                  height: '60px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'start',
                }}
              >
                <LocationOn sx={{ fontSize: 40, color: 'red' }} />
              </Box>
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  {item.activity}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  📍Location : {item.location}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  ⌚Time : {item.time}
                </Typography>
              </CardContent>
            </Card>
            {index !== allActivities.length - 1 && (
              <svg
                className="curve-line"
                width="60%"
                height="70"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <path
                  d={index % 2 === 0 ? 'M0,0 C0,100,100,0,98,100' : 'M98,0 C100,100,0,0,0,100'}
                  stroke="#FF5733"
                  strokeWidth="3"
                  fill="transparent"
                  strokeDasharray="3"
                />
              </svg>
            )}
          </Grid>
        ))}
      </Grid>
      {/* Fancy Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
          sx: {
            backdropFilter: 'blur(8px)',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
        }}
      >
        <Fade in={open}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: isSmallScreen ? '90%' : 500,
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.2)',
              borderRadius: 6,
              backdropFilter: 'blur(12px)',
              overflowY: 'auto',
              maxHeight: '90vh',
            }}
          >
            {/* HEADER WITH BRIGHT COLOR */}
            <Box
              sx={{
                background: 'linear-gradient(135deg,rgb(42, 60, 78),rgb(76, 106, 133))',
                color: 'white',
                borderTopLeftRadius: 6,
                borderTopRightRadius: 6,
                padding: '14px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                {selectedActivity?.activity}
              </Typography>
              <IconButton onClick={handleClose} sx={{ color: 'white' }}>
                <CloseIcon />
              </IconButton>
            </Box>

            {/* CONTENT */}
            <Box sx={{ padding: '20px' }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} display="flex" alignItems="center">
                  <LocationOnIcon sx={{ color: '#007bff', fontSize: 28, marginRight: 1 }} />
                  <Typography variant="body1">
                    <strong>Location:</strong> {selectedActivity?.location}
                  </Typography>
                </Grid>

                <Grid item xs={12} display="flex" alignItems="center">
                  <AccessTimeIcon sx={{ color: '#00c853', fontSize: 28, marginRight: 1 }} />
                  <Typography variant="body1">
                    <strong>Time:</strong> {selectedActivity?.time}
                  </Typography>
                </Grid>

                <Grid item xs={12} display="flex" alignItems="center">
                  <DescriptionIcon sx={{ color: '#ff1744', fontSize: 28, marginRight: 1 }} />
                  <Typography variant="body2">
                    <strong>Description:</strong> {selectedActivity?.description}
                  </Typography>
                </Grid>

                <Grid item xs={12} display="flex" alignItems="center">
                  <AttachMoneyIcon sx={{ color: '#2e7d32', fontSize: 28, marginRight: 1 }} />
                  <Typography variant="body2">
                    <strong>Entry Fee:</strong> {selectedActivity?.entry_fee}
                  </Typography>
                </Grid>

                <Grid item xs={12} display="flex" alignItems="center">
                  <DirectionsCarIcon sx={{ color: '#ff9100', fontSize: 28, marginRight: 1 }} />
                  <Typography variant="body2">
                    <strong>Transport:</strong> {selectedActivity?.transport}
                  </Typography>
                </Grid>

                <Grid item xs={12} display="flex" alignItems="center">
                  <TimerIcon sx={{ color: '#651fff', fontSize: 28, marginRight: 1 }} />
                  <Typography variant="body2">
                    <strong>Duration:</strong> {selectedActivity?.duration}
                  </Typography>
                </Grid>

                <Grid item xs={12} display="flex" alignItems="center">
                  <LocalParkingIcon sx={{ color: '#ffea00', fontSize: 28, marginRight: 1 }} />
                  <Typography variant="body2">
                    <strong>Parking:</strong> {selectedActivity?.parking}
                  </Typography>
                </Grid>

                <Grid item xs={12} display="flex" alignItems="center">
                  <SavingsIcon sx={{ color: '#009688', fontSize: 28, marginRight: 1 }} />
                  <Typography variant="body2">
                    <strong>Budget-Friendly Alternative:</strong>{' '}
                    {selectedActivity?.budget_friendly_alternative}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </Container>
  );
};

MapFlow.propTypes = {
  tripData: PropTypes.shape({
    days: PropTypes.arrayOf(
      PropTypes.shape({
        activities: PropTypes.arrayOf(
          PropTypes.shape({
            activity: PropTypes.string.isRequired,
            location: PropTypes.string.isRequired,
            time: PropTypes.string.isRequired,
            description: PropTypes.string,
            entry_fee: PropTypes.string,
            transport: PropTypes.string,
            duration: PropTypes.string,
            parking: PropTypes.string,
            budget_friendly_alternative: PropTypes.string,
          })
        ).isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default MapFlow;
