import React, { useState } from 'react';
import { sendEmail } from '../templates/emailService'; // Import your email service

function Contact() {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [toastMsg, setToastMsg] = useState('');

  const validate = () => {
    const newErrors = {};

    // Full Name validation
    if (!formData.fullName) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.length < 3) {
      newErrors.fullName = 'Full name must be at least 3 characters';
    }

    // Phone Number validation
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
    }

    // Message validation
    if (!formData.message) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length < 5) {
      newErrors.message = 'Message is too short';
    }
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
      await sendEmail('Contact Us Form', {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
      });
      setFormData({
        fullName: '',
        phone: '',
        email: '',
        message: '',
      });
      setToastMsg('Your message has been sent successfully!');
    } catch (error) {
      setToastMsg('Something went wrong, please try again!');
      console.error('Error:', error);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [id]: '' }));
  };

  return (
    <div>
      <section className="py-4">
        <div className="container">
          <div className="row">
            <div className="col-md-4 my-auto">
              <h4>Contact Us</h4>
            </div>
            <div className="col-md-8 my-auto">
              <h6 className="float-end">Home/Contact Us</h6>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container d-flex justify-content-center">
          <div className="card shadow col-md-6 col-lg-4 mx-auto">
            <div className="card-body">
              <h6>Contact Form</h6>
              <hr />
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="mb-1">Full Name</label>
                  <input
                    type="text"
                    className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
                    id="fullName"
                    placeholder="Enter full name"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                  {errors.fullName && (
                    <div className="invalid-feedback">{errors.fullName}</div>
                  )}
                </div>
                <div className="form-group">
                  <label className="mb-1">Phone Number</label>
                  <input
                    type="tel"
                    className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                    id="phone"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                  {errors.phone && (
                    <div className="invalid-feedback">{errors.phone}</div>
                  )}
                </div>
                <div className="form-group">
                  <label className="mb-1">Email Address</label>
                  <input
                    type="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    id="email"
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>
                <div className="form-group">
                  <label className="mb-1">Message</label>
                  <textarea
                    rows="3"
                    className={`form-control ${errors.message ? 'is-invalid' : ''}`}
                    id="message"
                    placeholder="Type your message"
                    value={formData.message}
                    onChange={handleChange}
                  ></textarea>
                  {errors.message && (
                    <div className="invalid-feedback">{errors.message}</div>
                  )}
                </div>
                <div className="form-group py-3">
                  <button
                    type="submit"
                    className="btn btn-warning shadow w-100"
                  >
                    Send Message
                  </button>
                </div>
              </form>
              {toastMsg && (
                <div className="alert alert-info mt-3">{toastMsg}</div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;
