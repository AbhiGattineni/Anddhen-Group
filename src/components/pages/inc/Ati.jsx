import React, { useState } from 'react';
import EnquiryForm from 'src/components/organisms/Forms/EnquiryForm';
import { Carousel, Container, Card, Button } from 'react-bootstrap';
import { Link, Routes, Route } from 'react-router-dom';
import FinanceDataUpload from './FinanceDataUpload';
import InvestmentOptionsTabs from './InvestmentOptionsTabs';

export const Ati = () => {
  const [setShowToast] = useState(false);
  const [setToastMsg] = useState('');

  return (
    <div className="section border-top">
      <Routes>
        <Route path="/finance-data" element={<FinanceDataUpload />} />
        <Route
          path="/"
          element={
            <>
              <h1 className="text-center">Anddhen Trading and Investment </h1>
              <div className="underline mx-auto"></div>
              <Carousel className="mt-4 mx-auto" style={{ maxWidth: '80%', maxHeight: '60%' }}>
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src="/assets/images/atiSlider1.jpg"
                    alt="First slide"
                    style={{ width: '600px', height: '300px' }}
                  />
                  <Carousel.Caption>
                    <h4 className="text-dark">Trade with us, grow with us</h4>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src="/assets/images/atiSlider2.jpg"
                    alt="Second slide"
                    style={{ width: '600px', height: '300px' }}
                  />
                  <Carousel.Caption>
                    <h4>Invest smart, grow from the start</h4>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src="/assets/images/atiSlider3.jpg"
                    alt="Third slide"
                    style={{ width: '600px', height: '300px' }}
                  />
                  <Carousel.Caption>
                    <h4>We flourish you in bullish & bearish</h4>
                  </Carousel.Caption>
                </Carousel.Item>
              </Carousel>

              {/* Cards Section */}
              <div className="container mt-5">
                <div className="row justify-content-center">
                  <div className="col-md-6 mb-4">
                    <Card className="shadow border-0">
                      <Card.Body className="text-center">
                        <Card.Title>House Price Predictor</Card.Title>
                        <Card.Text>Enter house features to predict its price instantly.</Card.Text>
                        <Button as={Link} to="house-price-predictor" variant="primary">
                          Predict Now
                        </Button>
                      </Card.Body>
                    </Card>
                  </div>
                  <div className="col-md-6 mb-4">
                    <Card className="shadow border-0">
                      <Card.Body className="text-center">
                        <Card.Title>Finance Data Management</Card.Title>
                        <Card.Text>Upload and analyze your financial statements.</Card.Text>
                        <Button as={Link} to="finance-data" variant="primary">
                          Manage Finance Data
                        </Button>
                      </Card.Body>
                    </Card>
                  </div>
                </div>
              </div>

              {/* Explore Global Investment Options - New Section */}
              <div className="investment-section mt-5 mb-5 p-4 rounded bg-white shadow-sm">
                <h2
                  className="text-center mb-4"
                  style={{ fontWeight: 600, fontSize: '2rem', letterSpacing: '0.5px' }}
                >
                  Explore Global Investment Options
                </h2>
                <InvestmentOptionsTabs />
              </div>

              <div className="mt-5 p-3 rounded bg-light">
                <Container>
                  <p className="p-2" style={{ textAlign: 'justify' }}>
                    Unlock the true potential of your investments with our expert stock market
                    management services. Specializing in short-term gains, we manage diverse
                    portfolios across the Indian and U.S. stock markets, focusing on equities, ETFs,
                    and other high-potential assets. Our team uses advanced market analysis, trend
                    predictions, and proven strategies to maximize profits quickly while minimizing
                    risk. Whether you are an experienced investor or just starting, we tailor our
                    approach to your financial goals and risk tolerance. With us, you get
                    personalized insights and cutting-edge strategies designed to capitalize on
                    short-term opportunities for rapid growth.
                  </p>
                </Container>
              </div>
              <EnquiryForm
                title="ATI : Andheen Trading and Investment Services"
                setShowToast={setShowToast}
                setToastMsg={setToastMsg}
              />
            </>
          }
        />
      </Routes>
    </div>
  );
};
