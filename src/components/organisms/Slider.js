import React from 'react';
import PropTypes from 'prop-types';
import './SliderStyles.css';
import 'react-lazy-load-image-component/src/effects/blur.css';

const ResponsiveImage = ({ src, alt }) => (
  <img src={src} className="d-block w-100 carousel-image" alt={alt} />
);

function Slider() {
  return (
    <div id="carouselExampleCaptions" className="carousel slide" data-bs-ride="carousel">
      <div className="carousel-indicators">
        <button
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide-to="0"
          className="active"
          aria-current="true"
          aria-label="Slide 1"
        ></button>
        <button
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide-to="1"
          aria-label="Slide 2"
        ></button>
        <button
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide-to="2"
          aria-label="Slide 3"
        ></button>
        <button
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide-to="3"
          aria-label="Slide 4"
        ></button>
      </div>
      <div className="carousel-inner">
        <div className="carousel-item active">
          <ResponsiveImage src="/assets/images/marketingupdated.jpg" alt="Slide 1" />
          <div className="carousel-caption d-none d-md-block">
            <div className="slider-content">
              <h2 className="slider-title">Anddhen Marketing Services</h2>
              <p className="slider-subtitle">
                Comprehensive marketing strategies to boost brand presence
              </p>
            </div>
          </div>
          <div className="text-center d-block d-md-none mobile-caption">
            <h5>Anddhen Marketing Services</h5>
          </div>
        </div>
        <div className="carousel-item">
          <ResponsiveImage src="/assets/images/consultingUpdated.jpg" alt="Slide 2" />
          <div className="carousel-caption d-none d-md-block">
            <div className="slider-content">
              <h2 className="slider-title">Anddhen Consulting Services</h2>
              <p className="slider-subtitle">
                Expert consulting for business development and growth
              </p>
            </div>
          </div>
          <div className="text-center d-block d-md-none mobile-caption">
            <h5>Anddhen Consulting Services</h5>
          </div>
        </div>
        <div className="carousel-item">
          <ResponsiveImage src="/assets/images/software.jpg" alt="Slide 3" />
          <div className="carousel-caption d-none d-md-block">
            <div className="slider-content">
              <h2 className="slider-title">Anddhen Software Services</h2>
              <p className="slider-subtitle">
                Innovative software solutions tailored to your needs
              </p>
            </div>
          </div>
          <div className="text-center d-block d-md-none mobile-caption">
            <h5>Anddhen Software Services</h5>
          </div>
        </div>
        <div className="carousel-item">
          <ResponsiveImage src="/assets/images/philo1.jpg" alt="Slide 4" />
          <div className="carousel-caption d-none d-md-block">
            <div className="slider-content">
              <h2 className="slider-title">Anddhen Philanthropy Services</h2>
              <p className="slider-subtitle">Supporting initiatives for positive social impact</p>
            </div>
          </div>
          <div className="text-center d-block d-md-none mobile-caption">
            <h5>Anddhen Philanthropy Services</h5>
          </div>
        </div>
      </div>
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExampleCaptions"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#carouselExampleCaptions"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
}

ResponsiveImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
};

export default Slider;
