import React from 'react';
import { Link } from 'react-router-dom';
import Service1 from '../images/portfolio.jpg';
import Service2 from '../images/web.jpg';
import Service3 from '../images/fullstack.png';
import Service4 from '../images/app.jpg';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const Services = () => {
  const services = [
    {
      Name: 'Portfolio/Business Websites',
      Photo: Service1,
      Description: 'We build portfolio websites',
    },
    {
      Name: 'Front End Web Applications',
      Photo: Service2,
      Description: 'We build portfolio websites',
    },
    {
      Name: 'Full Stack Development',
      Photo: Service3,
      Description: 'We build portfolio websites',
    },
    {
      Name: 'Mobile Application Development',
      Photo: Service4,
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
          {services.map((service) => (
            <div className="col-md-4 mb-3">
              <div className="card">
                <LazyLoadImage
                  effect="blur"
                  src={service.Photo}
                  className="w-100 border-bottom"
                  alt="services"
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
