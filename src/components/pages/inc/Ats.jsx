import React, { useState } from 'react';
import { Carousel, Container, Row, Col, Card, Toast } from 'react-bootstrap';
import travel1 from '../../images/travel1.jpg';
import travel2 from '../../images/travel2.jpg';
import travel3 from '../../images/travel3.avif';

import { sendEmail } from '../../templates/emailService';

export const Ats = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        countryCode: '+1',
        phone: '',
        message: ''
    });

    const [errors, setErrors] = useState({});
    const [showToast, setShowToast] = useState(false);
    const [toastMsg, setToastMsg] = useState('');

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        try {
            sendEmail("ATS: Anddhen Travel Services", {
                subsidary: "ATS: Anddhen Travel Services",
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
                message: ''
            });
            setToastMsg("Data successfully submitted!");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        } catch (error) {
            setToastMsg("Something went wrong!");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
            console.error("Error:", error);
        }
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [id]: value }));
        setErrors((prevErrors) => ({ ...prevErrors, [id]: '' }));
    };

    return (
        <div>
            <section className='section border-top'>
                <h1 className="text-center">Anddhen Travel Services</h1>
                <div className="underline mx-auto"></div>

                {/* Image Slider */}
                <Carousel className="mt-4 mx-auto" style={{ maxWidth: '80%', maxHeight: '60%' }}>
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
                        <p className='p-2' style={{ textAlign: 'justify' }}>
                            If you are an individual, group, couple, or family wanting to travel for a few days or just over the weekend, planning everything from the travel route, places to visit, flights, car rentals, hotels, restaurants, sightseeing, and timings can be overwhelming as a working individual. We understand the hassle and stress involved in organizing a trip, and that's where we come in to help you.

                            Whether it's finding the best flight options, booking comfortable accommodations, arranging car rentals, or recommending top-notch restaurants, we take care of everything. We also provide detailed itineraries that include must-see attractions and hidden gems, along with optimal timings to visit each place. Our goal is to make your travel experience as smooth and enjoyable as possible, allowing you to focus on making memories rather than worrying about logistics.
                        </p>
                    </Container>
                </div>

                {/* Steps */}
                <div className="mt-5">
                    <h2 className="text-center">How It Works</h2>
                    <div className="underline mx-auto"></div>
                    <Row className="justify-content-center mt-5">
                        <Col xs={12} md={2} className="text-center mb-4">
                            <Card className="border-0 shadow-sm">
                                <Card.Body>
                                    <div className="bg-warning text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '60px', height: '60px' }}>
                                        <i className="bi bi-geo-alt" style={{ fontSize: '1.5rem' }}></i>
                                    </div>
                                    <Card.Title className="text-dark">Decide</Card.Title>
                                    <Card.Text className="text-secondary">Decide which place you want to go</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xs={12} md={2} className="text-center mb-4">
                            <Card className="border-0 shadow-sm">
                                <Card.Body>
                                    <div className="bg-warning text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '60px', height: '60px' }}>
                                        <i className="bi bi-envelope" style={{ fontSize: '1.5rem' }}></i>
                                    </div>
                                    <Card.Title className="text-dark">Message</Card.Title>
                                    <Card.Text className="text-secondary">Message us using the form below</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xs={12} md={2} className="text-center mb-4">
                            <Card className="border-0 shadow-sm">
                                <Card.Body>
                                    <div className="bg-warning text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '60px', height: '60px' }}>
                                        <i className="bi bi-phone" style={{ fontSize: '1.5rem' }}></i>
                                    </div>
                                    <Card.Title className="text-dark">Relax</Card.Title>
                                    <Card.Text className="text-secondary">We will contact you and take details while you relax</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xs={12} md={2} className="text-center mb-4">
                            <Card className="border-0 shadow-sm">
                                <Card.Body>
                                    <div className="bg-warning text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '60px', height: '60px' }}>
                                        <i className="bi bi-pencil-square" style={{ fontSize: '1.5rem' }}></i>
                                    </div>
                                    <Card.Title className="text-dark">Customize</Card.Title>
                                    <Card.Text className="text-secondary">We will come up with plans and customize</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xs={12} md={2} className="text-center mb-4">
                            <Card className="border-0 shadow-sm">
                                <Card.Body>
                                    <div className="bg-warning text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '60px', height: '60px' }}>
                                        <i className="bi bi-send" style={{ fontSize: '1.5rem' }}></i>
                                    </div>
                                    <Card.Title className="text-dark">Start</Card.Title>
                                    <Card.Text className="text-secondary">Start the trip, and we will be with you throughout</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </div>

                {/* Contact Form */}
                <Container>
                    <Row className="justify-content-center">
                        <Col xs={12} md={8} lg={4}>
                            <div className="border border-2 rounded p-4 bg-light mt-4">
                                <h2 className="text-center">Contact Us</h2>
                                <div className="underline mx-auto mb-4"></div>
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="name" className="form-label">Name</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                            id="name"
                                            placeholder="Enter your name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Email</label>
                                        <input
                                            type="email"
                                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                            id="email"
                                            placeholder="Enter your email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                                    </div>
                                    <Row>
                                        <Col xs={4}>
                                            <div className="mb-3">
                                                <label htmlFor="countryCode" className="form-label">Code</label>
                                                <select
                                                    className="form-control"
                                                    id="countryCode"
                                                    value={formData.countryCode}
                                                    onChange={handleChange}
                                                    required
                                                >
                                                    <option value="+1">+1 (USA)</option>
                                                    <option value="+91">+91 (India)</option>
                                                </select>
                                            </div>
                                        </Col>
                                        <Col xs={8}>
                                            <div className="mb-3">
                                                <label htmlFor="phone" className="form-label">Phone</label>
                                                <input
                                                    type="phone"
                                                    className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                                    id="phone"
                                                    placeholder="Enter your phone number"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    required
                                                />
                                                {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                                            </div>
                                        </Col>
                                    </Row>
                                    <div className="mb-3">
                                        <label htmlFor="message" className="form-label">Message</label>
                                        <textarea
                                            className={`form-control ${errors.message ? 'is-invalid' : ''}`}
                                            id="message"
                                            rows="3"
                                            placeholder="Enter your message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                        ></textarea>
                                        {errors.message && <div className="invalid-feedback">{errors.message}</div>}
                                    </div>
                                    <div className="d-flex justify-content-center">
                                        <button type="submit" className="btn btn-primary">Submit</button>
                                    </div>
                                </form>
                            </div>
                        </Col>
                    </Row>
                </Container>
                <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
                    <Toast.Body>{toastMsg}</Toast.Body>
                </Toast>
            </section>
        </div>
    );
};

export default Ats;
