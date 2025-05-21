import React from 'react';

function Vmc() {
  return (
    <section className="section bg-c-light border-top">
      <div className="container">
        <div className="row">
          <div className="col-md-12 mb-4 text-center">
            <h3 className="main-heading">Vision, Mission & Values</h3>
            <div className="underline mx-auto"></div>
          </div>
          <div className="col-md-4 text-center">
            <h6>Our Vision</h6>
            <p style={{ textAlign: 'justify' }}>
              To be a beacon of innovation and integrity in the global marketplace, transforming
              businesses and communities through cutting-edge technology, strategic investment, and
              dedicated philanthropy. We envision a world where our conglomerate not only leads in
              providing comprehensive solutions across various sectors but also makes a substantial
              impact on societal advancement and sustainability.
            </p>
          </div>
          <div className="col-md-4 text-center">
            <h6>Our Mission</h6>
            <p style={{ textAlign: 'justify' }}>
              Our mission is to empower our clients and communities by delivering exceptional
              services across software development, staffing and consulting, trading and investment,
              and marketing. We are committed to fostering growth, efficiency, and success for our
              partners while upholding our commitment to social responsibility. Through our
              expertise and philanthropic initiatives, we strive to create opportunities that drive
              positive change and contribute to a better future.
            </p>
          </div>
          <div className="col-md-4 text-center">
            <h6>Our Values</h6>
            <p style={{ textAlign: 'justify' }}>
              <strong>Innovation:</strong> We strive to lead with creativity, continually seeking
              new and better ways to serve our community.
              <strong> Inclusion:</strong> We embrace diversity and foster an environment where
              everyone feels valued and respected.
              <strong> Responsibility:</strong> We aim to make a positive impact on society, taking
              conscious steps to be sustainable and ethical in our practices.
              <strong> Collaboration:</strong> We believe in the power of building strong
              partnerships, working together to achieve common goals and drive success.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Vmc;
