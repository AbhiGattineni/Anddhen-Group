import React from 'react';
import { Carousel, Container, Row, Col,Card } from 'react-bootstrap';
import travel1 from '../../images/travel1.jpg';
import travel2 from '../../images/travel2.jpg';
import travel3 from '../../images/travel3.avif';

export const Ats = () => {
    return (
        <div><style jsx="true">{`
            .carousel-custom {
                width: 600px;
                height: 300px;
                margin: 0 auto;
            }

            .step-card {
                border: none;
                background-color: white;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                transition: transform 0.3s ease, box-shadow 0.3s ease;
            }

            .step-card:hover {
                transform: translateY(-10px);
                box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
            }

            .step-number {
                width: 60px;
                height: 60px;
                font-size: 2rem;
                margin-bottom: 1rem;
            }

            .step-number i {
                font-size: 1.5rem;
            }
        `}</style>
        <section className='section bg-c-light border-top'>
                <h1 className="main-heading text-center">Anddhen Travel Services</h1>
                <div className="underline mx-auto"></div>

                {/* Image Slider */}
                <Carousel className="mt-4" style={{ width: '80%', height: '60%', margin: '0 auto' }}>
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src={travel1} // Replace with travel-related images
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
                            src={travel2} // Replace with travel-related images
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
                            src={travel3} // Replace with travel-related images
                            alt="Third slide"
                            style={{ width: '600px', height: '300px' }}
                        />
                        <Carousel.Caption>
                            <h3>Relax and Enjoy</h3>
                        </Carousel.Caption>
                    </Carousel.Item>
                </Carousel>

                {/* Description */}
                <div className="mt-4 p-3 rounded" style={{backgroundColor: "#f3f3f3"}}>
                <div className="container">
                    <p className='p-2' style={{ textAlign: 'justify' }}>
                        If you are an individual, group, couple, or family wanting to travel for a few days or just over the weekend, planning everything from the travel route, places to visit, flights, car rentals, hotels, restaurants, sightseeing, and timings can be overwhelming as a working individual. We understand the hassle and stress involved in organizing a trip, and that's where we come in to help you.

                        Whether it's finding the best flight options, booking comfortable accommodations, arranging car rentals, or recommending top-notch restaurants, we take care of everything. We also provide detailed itineraries that include must-see attractions and hidden gems, along with optimal timings to visit each place. Our goal is to make your travel experience as smooth and enjoyable as possible, allowing you to focus on making memories rather than worrying about logistics.
                   
                    </p>
                </div>
                </div>

                {/* Steps */}
                <div className="mt-5">
                <h2 className="main-heading text-center">How It Works</h2>
                    <div className="underline mx-auto"></div>
                    <Row className="justify-content-center mt-5">
                        <Col xs={12} md={2} className="text-center mb-4">
                            <Card className="step-card">
                                <Card.Body>
                                    <div className="step-number text-white rounded-circle d-flex align-items-center justify-content-center mx-auto " style={{backgroundColor:"#f76c2f"}}>
                                        <i className="bi bi-geo-alt"></i>
                                    </div>
                                    <Card.Title style={{ color: '#343a40' }}>Decide</Card.Title>
                                    <Card.Text style={{ color: '#6c757d' }}>Decide which place you want to go</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xs={12} md={2} className="text-center mb-4">
                            <Card className="step-card">
                                <Card.Body>
                                    <div className="step-number text-white rounded-circle d-flex align-items-center justify-content-center mx-auto" style={{backgroundColor:"#f76c2f"}}>
                                        <i className="bi bi-envelope"></i>
                                    </div>
                                    <Card.Title style={{ color: '#343a40' }}>Message</Card.Title>
                                    <Card.Text style={{ color: '#6c757d' }}>Message us using the form below</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xs={12} md={2} className="text-center mb-4">
                            <Card className="step-card">
                                <Card.Body>
                                    <div className="step-number text-white rounded-circle d-flex align-items-center justify-content-center mx-auto" style={{backgroundColor:"#f76c2f"}}>
                                        <i className="bi bi-phone"></i>
                                    </div>
                                    <Card.Title style={{ color: '#343a40' }}>Relax</Card.Title>
                                    <Card.Text style={{ color: '#6c757d' }}>We will contact you and take details while you relax</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xs={12} md={2} className="text-center mb-4">
                            <Card className="step-card">
                                <Card.Body>
                                    <div className="step-number text-white rounded-circle d-flex align-items-center justify-content-center mx-auto" style={{backgroundColor:"#f76c2f"}}>
                                        <i className="bi bi-pencil-square"></i>
                                    </div>
                                    <Card.Title style={{ color: '#343a40' }}>Customize</Card.Title>
                                    <Card.Text style={{ color: '#6c757d' }}>We will come up with plans and customize</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xs={12} md={2} className="text-center mb-4">
                            <Card className="step-card">
                                <Card.Body>
                                    <div className="step-number text-white rounded-circle d-flex align-items-center justify-content-center mx-auto" style={{backgroundColor:"#f76c2f"}}>
                                        <i className="bi bi-send"></i>
                                    </div>
                                    <Card.Title style={{ color: '#343a40' }}>Start</Card.Title>
                                    <Card.Text style={{ color: '#6c757d' }}>Start the trip, and we will be with you throughout</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </div>
        </section>
        </div>
    );
};

export default Ats;
