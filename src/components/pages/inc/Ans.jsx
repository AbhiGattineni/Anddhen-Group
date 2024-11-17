import React, { useState } from 'react';
import { Carousel, Container, Row, Col, Card } from 'react-bootstrap';

import EnquiryForm from 'src/components/organisms/Forms/EnquiryForm';
import CustomToast from 'src/components/atoms/Toast/CustomToast';
import ShoppingPage from 'src/components/generalComponents/ShoopingPage';
export const Ans = () => {
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  return (
    <div>
      <section className="section border-top">
        <h1 className="text-center">Anddhen NRI Services</h1>
        <div className="underline mx-auto"></div>

        {/* Image Slider */}
        <Carousel
          className="mt-4 mx-auto"
          style={{ maxWidth: '80%', maxHeight: '60%' }}
        >
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="/assets/images/services1.png"
              alt="First slide"
              style={{ width: '600px', height: '300px' }}
            />
            <Carousel.Caption>
              <h3 className="text-dark">Your Support in India</h3>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="/assets/images/services2.png"
              alt="Second slide"
              style={{ width: '600px', height: '300px' }}
            />
            <Carousel.Caption>
              <h3>For Your Loved Ones</h3>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="/assets/images/services3.png"
              alt="Third slide"
              style={{ width: '600px', height: '300px' }}
            />
            <Carousel.Caption>
              <h3>Special Occasions Covered</h3>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>

        {/* Description */}
        <div className="mt-5 p-3 rounded bg-light">
          <Container>
            <p className="p-2" style={{ textAlign: 'justify' }}>
              At Anddhen NRI Services, we are dedicated to providing
              comprehensive assistance to NRIs who wish to stay connected with
              India. Whether you need to manage tasks for your family, send
              gifts on special occasions, or require assistance with any other
              needs in India, we are here to help you every step of the way. We
              understand the challenges of being far away and the desire to
              maintain a strong bond with your home country.
            </p>
            <p className="p-2" style={{ textAlign: 'justify' }}>
              Our services extend to assisting NRIs in supporting their families
              back home. From handling essential tasks for your parents and
              relatives to arranging timely deliveries for festivals and
              birthdays, we ensure that your presence is felt even when you are
              miles away.
            </p>
          </Container>
        </div>

        {/* Steps */}
        <div className="mt-5">
          <h2 className="text-center">Our Services</h2>
          <div className="underline mx-auto"></div>
          <Row className="justify-content-center mt-5">
            <Col xs={12} md={3} className="text-center mb-4">
              <Card className="border-0 shadow-lg">
                <Card.Body>
                  <div
                    className="bg-warning text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                    style={{ width: '60px', height: '60px' }}
                  >
                    <i
                      className="bi bi-heart"
                      style={{ fontSize: '1.5rem' }}
                    ></i>
                  </div>
                  <Card.Title className="text-dark">Family Care</Card.Title>
                  <Card.Text className="text-secondary">
                    Arrange services for parents and relatives with ease.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} md={3} className="text-center mb-4">
              <Card className="border-0 shadow-lg">
                <Card.Body>
                  <div
                    className="bg-warning text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                    style={{ width: '60px', height: '60px' }}
                  >
                    <i
                      className="bi bi-gift"
                      style={{ fontSize: '1.5rem' }}
                    ></i>
                  </div>
                  <Card.Title className="text-dark">
                    Gifts & Surprises
                  </Card.Title>
                  <Card.Text className="text-secondary">
                    Send gifts and surprises for special occasions in India.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} md={3} className="text-center mb-4">
              <Card className="border-0 shadow-lg">
                <Card.Body>
                  <div
                    className="bg-warning text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                    style={{ width: '60px', height: '60px' }}
                  >
                    <i
                      className="bi bi-globe"
                      style={{ fontSize: '1.5rem' }}
                    ></i>
                  </div>
                  <Card.Title className="text-dark">NRI Services</Card.Title>
                  <Card.Text className="text-secondary">
                    All-in-one support for managing tasks in India, from family
                    care to sending gifts.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>

        <ShoppingPage />

        {/* Contact Form */}
        <EnquiryForm
          title="ANS: Anddhen NRI Services"
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

export default Ans;
