import React from 'react';
import { Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const Services = () => {
  const services = [
    {
      Name: 'Portfolio/Business Websites',
      Photo: '/assets/images/BussinessWebsite.jpg',
      Description: 'We build portfolio websites',
    },
    {
      Name: 'Front End Web Applications',
      Photo: '/assets/images/frontend.jpg',
      Description: 'We build portfolio websites',
    },
    {
      Name: 'Full Stack Development',
      Photo: '/assets/images/fullstack.jpg',
      Description: 'We build portfolio websites',
    },
    {
      Name: 'Mobile Application Development',
      Photo: '/assets/images/app.jpg',
      Description: 'We build portfolio websites',
    },
  ];
  return (
    <section className="section">
      <div className="container">
        <div className="row">
          <div className="col-md-12 mb-4 text-center">
            <h3 className="main-heading">Our Services</h3>
            <div className="underline mx-auto"></div>
          </div>
          {services.map((service, index) => (
            <div className="col-md-4 mb-3" key={index}>
              <div className="card">
                <LazyLoadImage
                  effect="blur"
                  src={service.Photo}
                  alt="services"
                  className="w-100 border-bottom"
                  style={{
                    height: '250px', // Fixed height
                    // Crop the image to fill the container
                  }}
                />
                <div className="card-body">
                  <h6>{service.Name}</h6>
                  <div className="underline"></div>
                  <p>{service.Description}</p>
                  <Link to="/services" className="btn btn-warning shadow">
                    Read More
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
