/*import React from "react";
import { Link } from "react-router-dom";

function Company() {
  return (
    <section className="section">
      <div className="container">
        <div className="row">
          <div className="col-md-12 text-center">
            <h3 className="main-heading">Our Company</h3>
            <div className="underline mx-auto"></div>
            <p>
            At Anddhen, we pride ourselves on being more than just a business; we are a conglomerate with a heart, deeply invested in the fabric of India's dynamic market and beyond. With a diverse portfolio that spans software development, staffing and consulting, trading and investment, and comprehensive marketing services, we are dedicated to offering bespoke solutions tailored to your unique needs.
            </p>
            <p>
            Our expertise is not confined to delivering exceptional services; we are also committed to making a difference through our philanthropic endeavors. We believe in the power of giving back and are actively involved in various initiatives that contribute to the betterment of communities and foster sustainable development.
            </p>
            <p>
            Whether you are seeking cutting-edge software solutions, expert consulting, strategic investment opportunities, or innovative marketing strategies, Anddhen is your go-to partner. Our approach is holistic, ensuring that every service we provide is aligned with our clients' aspirations, delivering results that matter.
            </p>
            <p>
            <b>
            Choose Anddhen, where our services meet your ambition, and together, we create not just success, but a legacy of positive impact.
            </b>
            </p>
            <Link to="/about" className="btn btn-warning shadow">
              Read More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Company;*/
import React from 'react';
import { Link } from 'react-router-dom';
import './Company.css';
function Company() {
  return (
    <section className="section custom-margin">
      <div className="container">
        <div className="row">
          <div className="col-md-12 text-center">
            <h3 className="main-heading">Our Company</h3>
            <div className="underline mx-auto"></div>
            <p>
              At Anddhen, we pride ourselves on being more than just a business; we are a
              conglomerate with a heart, deeply invested in the fabric of India&apos;s dynamic
              market and beyond. that spans software development, staffing and consulting, trading
              and investment, and comprehensive marketing services, we are dedicated to offering
              bespoke solutions tailored to your unique needs.
            </p>
            <p>
              Our expertise is not confined to delivering exceptional services; we are also
              committed to making a difference through our philanthropic endeavors. We believe in
              the power of giving back and are actively involved in various initiatives that
              contribute to the betterment of communities and foster sustainable development.
            </p>
            <p>
              Whether you are seeking cutting-edge software solutions, expert consulting, strategic
              investment opportunities, or innovative marketing strategies, Anddhen is your go-to
              partner. Our approach is holistic, ensuring that every service we provide is aligned
              with our client aspirations, delivering results that matter.
            </p>
            <p>
              <b>
                Choose Anddhen, where our services meet your ambition, and together, we create not
                just success, but a legacy of positive impact.
              </b>
            </p>
            <Link to="/about" className="btn btn-warning shadow">
              Read More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Company;
