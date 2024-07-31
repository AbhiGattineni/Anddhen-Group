import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { sendEmail } from '../../templates/emailService';

const EnquiryForm = ({ title, setShowToast, setToastMsg }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        countryCode: '+1',
        phone: '',
        message: ''
    });

    const [errors, setErrors] = useState({});

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
            sendEmail(title, {
                subsidary: title,
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
        } catch (error) {
            setToastMsg("Something went wrong!");
            setShowToast(true);
            console.error("Error:", error);
        }
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [id]: value }));
        setErrors((prevErrors) => ({ ...prevErrors, [id]: '' }));
    };

    return (
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
    );
};

export default EnquiryForm;
