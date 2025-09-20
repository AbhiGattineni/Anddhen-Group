import React, { useState } from 'react';
import EnquiryForm from 'src/components/organisms/Forms/EnquiryForm';
import { Carousel, Container, Card, Button, Row, Col } from 'react-bootstrap';
import { Link, Routes, Route } from 'react-router-dom';
import FinanceDataUpload from './FinanceDataUpload';
import InvestmentOptionsTabs from './InvestmentOptionsTabs';

export const Ati = () => {
  const [activeTab, setActiveTab] = useState('');
  const [, setShowToast] = useState(false);
  const [, setToastMsg] = useState('');

  const investmentData = {
    usa: [
      {
        title: '401(k)',
        description:
          'Employer-sponsored retirement savings plan. Money is taken from your paycheck before tax.',
        advantages: [
          'Employer matching (free money)',
          'Tax-deferred growth',
          'Large annual contribution limit',
        ],
        disadvantages: [
          'Early withdrawal penalties',
          'Limited investment options',
          'Required minimum distributions after age 73',
        ],
      },
      {
        title: 'Roth IRA',
        description: 'Personal retirement account where you invest post-tax money.',
        advantages: [
          'Tax-free withdrawals during retirement',
          'Flexible investment choices',
          'No tax on gains if held long-term',
        ],
        disadvantages: [
          'Income limits for eligibility',
          'Contributions are not tax-deductible',
          '5-year rule for qualified withdrawals',
        ],
      },
    ],
    uk: [
      {
        title: 'ISA',
        description: 'Tax-free account for saving or investing up to a limit.',
        advantages: [
          'No tax on interest, dividends, or gains',
          'Multiple ISA types',
          'Can withdraw anytime (except Lifetime ISA)',
        ],
        disadvantages: [
          'Annual contribution limits apply',
          'No tax relief on contributions',
          'Lifetime ISA has penalties if misused',
        ],
      },
      {
        title: 'Workplace Pension',
        description: 'Retirement plan where employer and employee both contribute.',
        advantages: [
          'Free money from employer',
          'Tax relief from government',
          'Automatic savings from salary',
        ],
        disadvantages: [
          'Locked until retirement age',
          'Pension income may be taxed',
          'Fees vary by provider',
        ],
      },
    ],
    india: [
      {
        title: 'PPF',
        description: '15-year government-backed savings scheme for individuals.',
        advantages: [
          'Tax-free interest',
          'Safe and stable returns',
          'Partial withdrawal after 6 years',
        ],
        disadvantages: [
          'Long lock-in period (15 years)',
          'Limited annual contribution',
          'Lower returns than stocks',
        ],
      },
      {
        title: 'Stocks',
        description: 'Buying shares in Indian companies.',
        advantages: ['High returns possible', 'No lock-in period', 'Easy to invest online'],
        disadvantages: ['High market volatility', 'Requires knowledge', 'Capital loss possible'],
      },
    ],
    canada: [
      {
        title: 'RRSP',
        description: 'Retirement plan where contributions reduce your taxable income.',
        advantages: [
          'Tax-deductible contributions',
          'Tax-free growth until withdrawal',
          'Good for long-term savings',
        ],
        disadvantages: [
          'Withdrawals are taxed',
          'Mandatory withdrawals by age 71',
          'Over-contribution penalties',
        ],
      },
      {
        title: 'TFSA',
        description: 'Flexible savings/investment account with tax-free gains.',
        advantages: ['No tax on gains', 'Withdraw anytime without penalty', 'Use for any goal'],
        disadvantages: [
          'Annual contribution limits',
          'No tax deduction on contributions',
          'Over-contribution penalties',
        ],
      },
    ],
    australia: [
      {
        title: 'Superannuation',
        description: 'Compulsory retirement savings from salary with employer contributions.',
        advantages: [
          'Tax-concessional growth',
          'Employer contributes extra',
          'Long-term wealth generation',
        ],
        disadvantages: ['Locked until retirement', 'Returns vary with market', 'Complex rules'],
      },
      {
        title: 'Shares (Stocks)',
        description: 'Buying parts of companies for capital growth.',
        advantages: [
          'High growth over time',
          'Regular dividends possible',
          'Control over investments',
        ],
        disadvantages: ['Market volatility', 'Requires monitoring', 'Capital loss possible'],
      },
    ],
  };

  return (
    <div className="section">
      <Routes>
        <Route path="/finance-data" element={<FinanceDataUpload />} />
        <Route
          path="/"
          element={
            <>
              <h1 className="text-center">Anddhen Trading and Investment</h1>
              <div className="underline mx-auto"></div>

              {/* Carousel */}
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

              {/* Redesigned Investment Options Section */}
              <Container className="my-5 p-4 rounded bg-white shadow border-0">
                <h1 className="text-center">Explore Global Investment Options</h1>
                <div className="underline mx-auto"></div>
                <p className="text-center text-secondary mb-4">
                  Compare top investment types by country – understand the pros and cons, and decide
                  what aligns best with your financial goals.
                </p>

                {/* Country Tabs */}
                <div className="text-center mb-4">
                  {Object.keys(investmentData).map(country => (
                    <Button
                      key={country}
                      variant={activeTab === country ? 'primary' : 'outline-primary'}
                      className="m-2 px-4"
                      onClick={() => setActiveTab(country)}
                    >
                      {country.toUpperCase()}
                    </Button>
                  ))}
                </div>

                {/* Show investment cards only if a country is selected */}
                {activeTab && (
                  <Row className="justify-content-center mt-3">
                    {investmentData[activeTab].map((item, idx) => (
                      <Col xs={12} md={6} lg={5} className="mb-4" key={idx}>
                        <Card className="h-100 border-0">
                          <Card.Body>
                            <Card.Title
                              className="text-center fw-semibold"
                              style={{ fontSize: '1.25rem' }}
                            >
                              {item.title}
                            </Card.Title>
                            <Card.Text className="text-muted">{item.description}</Card.Text>
                            <div className="mt-3">
                              <h6 className="fw-bold text-dark">Advantages</h6>
                              <ul className="ps-3 mb-3">
                                {item.advantages.map((adv, i) => (
                                  <li key={i} className="fs-6">
                                    {adv}
                                  </li>
                                ))}
                              </ul>
                              <h6 className="fw-bold text-dark">Disadvantages</h6>
                              <ul className="ps-3">
                                {item.disadvantages.map((disadv, i) => (
                                  <li key={i} className="fs-6">
                                    {disadv}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                )}
              </Container>

              {/* Info Section */}
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

              {/* Enquiry Form */}
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
