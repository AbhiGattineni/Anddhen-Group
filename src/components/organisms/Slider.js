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
        <button
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide-to="4"
          aria-label="Slide 5"
        ></button>
      </div>
      <div className="carousel-inner">
        <div className="carousel-item active">
          <ResponsiveImage src="/assets/images/marketingupdated.jpg" alt="Slide 1" />
          <div className="carousel-caption d-none d-md-block ">
            <h5 className="bg-white rounded-pill d-inline-block p-2 " style={{ color: 'tomato' }}>
              Anddhen Marketing Services
            </h5>
          </div>
          <div className="text-center d-block d-md-none text-black p-3">
            <p className="">Anddhen Marketing Services</p>
          </div>
        </div>
        <div className="carousel-item">
          <ResponsiveImage src="/assets/images/consultingUpdated.jpg" alt="Slide 2" />
          <div className="carousel-caption d-none d-md-block text-danger">
            <h5 className="bg-white rounded-pill d-inline-block p-2">
              Anddhen Consulting Services
            </h5>
          </div>
          <div className="text-center d-block d-md-none text-black p-3">
            <p>Anddhen Consulting Services</p>
          </div>
        </div>
        <div className="carousel-item">
          <ResponsiveImage src="/assets/images/software.jpg" alt="Slide 3" />
          <div className="carousel-caption d-none d-md-block">
            <h5 className="bg-white rounded-pill d-inline-block p-2" style={{ color: 'tomato' }}>
              Anddhen Software Services
            </h5>
          </div>
          <div className="text-center d-block d-md-none text-black p-3">
            <p>Anddhen Software Services</p>
          </div>
        </div>
        <div className="carousel-item">
          <ResponsiveImage src="/assets/images/philo1.jpg" alt="Slide 4" />
          <div className="carousel-caption d-none d-md-block text-danger">
            <h5 className="bg-white rounded-pill d-inline-block p-2">
              Anddhen Philanthropy Services
            </h5>
          </div>
          <div className="text-center d-block d-md-none text-black p-3">
            <p>Anddhen Philanthropy Services</p>
          </div>
        </div>
        <div className="carousel-item">
          <ResponsiveImage src="/assets/images/tradingupdated.jpg" alt="Slide 5" />
          <div className="carousel-caption d-none d-md-block ">
            <h5 className="bg-white rounded-pill d-inline-block p-2  " style={{ color: 'tomato' }}>
              Anddhen Trading & Investment
            </h5>
          </div>
          <div className="text-center d-block d-md-none text-black p-3">
            <p>Anddhen Trading & Investment</p>
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
