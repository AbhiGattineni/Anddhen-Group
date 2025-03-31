import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { Card, Typography } from '@mui/material';
import PropTypes from 'prop-types';

const ItineraryPlan = ({ data }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleShow = (activity) => {
    setSelectedActivity(activity);
    setShowModal(true);
  };

  return (
    <Container
      className="mt-5 text-white"
      style={{
        padding: '40px',
        borderRadius: '10px',
      }}
    >
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        style={{ color: '#333', fontFamily: 'cursive' }}
      >
        Itinerary Plan
      </Typography>
      <div className="timeline position-relative d-flex flex-column align-items-center">
        {data?.days?.map((day, dayIndex) => (
          <div key={dayIndex} className="w-100">
            <h3 className="text-center my-2">Day {day.day}</h3>
            {day.activities.map((activity, index) => (
              <div
                key={index}
                className={`timeline-item d-flex w-100 position-relative mb-4 ${
                  isSmallScreen
                    ? 'justify-content-start ps-5'
                    : index % 2 === 0
                      ? 'justify-content-start'
                      : 'justify-content-end'
                }`}
              >
                <div
                  className="timeline-icon bg-info text-white rounded-circle d-flex align-items-center justify-content-center position-absolute"
                  style={{
                    width: '50px',
                    height: '50px',
                    top: '50%',
                    left: isSmallScreen ? '-0.5rem' : '50%',
                    transform: isSmallScreen
                      ? 'translateY(-50%)'
                      : 'translate(-50%, -50%)',
                    zIndex: 100,
                  }}
                >
                  {dayIndex * data.days[0].activities.length + index + 1}
                </div>
                <div
                  className="timeline-content p-3 text-start"
                  style={{ maxWidth: '400px', cursor: 'pointer' }}
                  onClick={() => handleShow(activity)}
                >
                  <Card
                    style={{
                      backgroundColor: '#f8f9fa',
                      padding: '15px',
                      color: '#333',
                      borderRadius: '8px',
                      boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                      {activity.activity}
                    </Typography>
                    <Typography variant="subtitle2">
                      {activity.location}
                    </Typography>
                    <Typography variant="body2" style={{ marginTop: '10px' }}>
                      Time: {activity.time}
                    </Typography>
                    <Typography variant="body2">
                      Entry Fee: {activity.entry_fee}
                    </Typography>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        ))}
        <div
          className="timeline-line position-absolute bg-info rounded"
          style={{
            width: '4px',
            height: '100%',
            left: isSmallScreen ? '1rem' : '50%',
            top: 0,
            transform: isSmallScreen ? 'none' : 'translateX(-50%)',
          }}
        ></div>
      </div>

      {/* Modal for Activity Details */}
      {showModal && selectedActivity && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          style={{
            background: 'rgba(0, 0, 0, 0.5)',
            width: '100%',
            height: '100%',
          }}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div
                className="modal-header"
                style={{ display: 'flex', justifyContent: 'space-between' }}
              >
                <h5 className="modal-title" style={{ color: 'black' }}>
                  {selectedActivity.activity}
                </h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setShowModal(false)}
                >
                  &times;
                </button>
              </div>
              <div className="modal-body">
                <p>{selectedActivity.description}</p>
                <p>
                  <strong>Location:</strong> {selectedActivity.location}
                </p>
                <p>
                  <strong>Time:</strong> {selectedActivity.time}
                </p>
                <p>
                  <strong>Entry Fee:</strong> {selectedActivity.entry_fee}
                </p>
                <p>
                  <strong>Transport:</strong> {selectedActivity.transport}
                </p>
                <p>
                  <strong>Duration:</strong> {selectedActivity.duration}
                </p>
                <p>
                  <strong>Parking:</strong> {selectedActivity.parking}
                </p>
              </div>
              <div className="modal-footer">
                <a
                  href={selectedActivity.booking_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  Booking Link
                </a>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
};

ItineraryPlan.propTypes = {
  data: PropTypes.shape({
    days: PropTypes.arrayOf(
      PropTypes.shape({
        day: PropTypes.number.isRequired,
        activities: PropTypes.arrayOf(
          PropTypes.shape({
            activity: PropTypes.string.isRequired,
            location: PropTypes.string.isRequired,
            time: PropTypes.string.isRequired,
            entry_fee: PropTypes.string,
          }),
        ).isRequired,
      }),
    ).isRequired,
  }).isRequired,
};

export default ItineraryPlan;
