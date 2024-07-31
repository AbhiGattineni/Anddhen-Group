import React, { useState } from 'react';
import { Carousel, Container, Row, Col, Card } from 'react-bootstrap';

import travel1 from '../../images/travel1.jpg';
import travel2 from '../../images/travel2.jpg';
import travel3 from '../../images/travel3.avif';
import EnquiryForm from 'src/components/organisms/Forms/EnquiryForm';
import CustomToast from 'src/components/atoms/Toast/CustomToast';

export const Ats = () => {
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  return (
    <div>
      <section className="section border-top">
        <h1 className="text-center">Anddhen Travel Services</h1>
        <div className="underline mx-auto"></div>

        {/* Image Slider */}
        <Carousel
          className="mt-4 mx-auto"
          style={{ maxWidth: '80%', maxHeight: '60%' }}
        >
          <Carousel.Item>
            <img
              className="d-block w-100"
              src={travel1}
              alt="First slide"
              style={{ width: '600px', height: '300px' }}
            />
            <Carousel.Caption>
              <h3>Explore New Destinations</h3>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src={travel2}
              alt="Second slide"
              style={{ width: '600px', height: '300px' }}
            />
            <Carousel.Caption>
              <h3>Adventure Awaits</h3>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src={travel3}
              alt="Third slide"
              style={{ width: '600px', height: '300px' }}
            />
            <Carousel.Caption>
              <h3>Relax and Enjoy</h3>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>

        {/* Description */}
        <div className="mt-5 p-3 rounded bg-light">
          <Container>
            <p className="p-2" style={{ textAlign: 'justify' }}>
              If you are an individual, group, couple, or family wanting to
              travel for a few days or just over the weekend, planning
              everything from the travel route, places to visit, flights, car
              rentals, hotels, restaurants, sightseeing, and timings can be
              overwhelming as a working individual. We understand the hassle and
              stress involved in organizing a trip, and that's where we come in
              to help you. Whether it's finding the best flight options, booking
              comfortable accommodations, arranging car rentals, or recommending
              top-notch restaurants, we take care of everything. We also provide
              detailed itineraries that include must-see attractions and hidden
              gems, along with optimal timings to visit each place. Our goal is
              to make your travel experience as smooth and enjoyable as
              possible, allowing you to focus on making memories rather than
              worrying about logistics.
            </p>
          </Container>
        </div>

        {/* Steps */}
        <div className="mt-5">
          <h2 className="text-center">How It Works</h2>
          <div className="underline mx-auto"></div>
          <Row className="justify-content-center mt-5">
            <Col xs={12} md={2} className="text-center mb-4">
              <Card className="border-0 shadow-lg">
                <Card.Body>
                  <div
                    className="bg-warning text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                    style={{ width: '60px', height: '60px' }}
                  >
                    <i
                      className="bi bi-geo-alt"
                      style={{ fontSize: '1.5rem' }}
                    ></i>
                  </div>
                  <Card.Title className="text-dark">Decide</Card.Title>
                  <Card.Text className="text-secondary">
                    Decide which place you want to go
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} md={2} className="text-center mb-4">
              <Card className="border-0 shadow-lg">
                <Card.Body>
                  <div
                    className="bg-warning text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                    style={{ width: '60px', height: '60px' }}
                  >
                    <i
                      className="bi bi-envelope"
                      style={{ fontSize: '1.5rem' }}
                    ></i>
                  </div>
                  <Card.Title className="text-dark">Message</Card.Title>
                  <Card.Text className="text-secondary">
                    Message us using the form below
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} md={2} className="text-center mb-4">
              <Card className="border-0 shadow-lg">
                <Card.Body>
                  <div
                    className="bg-warning text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                    style={{ width: '60px', height: '60px' }}
                  >
                    <i
                      className="bi bi-phone"
                      style={{ fontSize: '1.5rem' }}
                    ></i>
                  </div>
                  <Card.Title className="text-dark">Relax</Card.Title>
                  <Card.Text className="text-secondary">
                    We will contact you and take details while you relax
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} md={2} className="text-center mb-4">
              <Card className="border-0 shadow-lg">
                <Card.Body>
                  <div
                    className="bg-warning text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                    style={{ width: '60px', height: '60px' }}
                  >
                    <i
                      className="bi bi-pencil-square"
                      style={{ fontSize: '1.5rem' }}
                    ></i>
                  </div>
                  <Card.Title className="text-dark">Customize</Card.Title>
                  <Card.Text className="text-secondary">
                    We will come up with plans and customize
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} md={2} className="text-center mb-4">
              <Card className="border-0 shadow-lg">
                <Card.Body>
                  <div
                    className="bg-warning text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                    style={{ width: '60px', height: '60px' }}
                  >
                    <i
                      className="bi bi-send"
                      style={{ fontSize: '1.5rem' }}
                    ></i>
                  </div>
                  <Card.Title className="text-dark">Start</Card.Title>
                  <Card.Text className="text-secondary">
                    Start the trip, and we will be with you throughout
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>

        {/* Contact Form */}
        <EnquiryForm
          title="ATS: Anddhen Travel Services"
          setShowToast={setShowToast}
          setToastMsg={setToastMsg}
        />
        <CustomToast
          showToast={showToast}
          setShowToast={setShowToast}
          toastMsg={toastMsg}
        />
      </section>
    </div>
  );
};

export default Ats;
