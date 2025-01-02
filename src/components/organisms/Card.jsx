import React from 'react';
import PropTypes from 'prop-types'; // Import prop-types library
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import useAuthStore from 'src/services/store/globalStore';

export const Card = (props) => {
  function handleClick() {
    useAuthStore.setState({ teamDetails: null });
    useAuthStore.setState({ myWorkData: props });
  }
  return (
    <div onClick={handleClick}>
      <div className="card h-100 cursor-pointer">
        <LazyLoadImage
          effect="blur"
          src={props.image}
          className="w-100 border-bottom"
          alt="services"
          height="200px"
        />
        <div className="card-body d-flex flex-column align-items-center">
          <h6 className="truncate-text">{props.title}</h6>
          <div className="underline"></div>
          <p className="truncate-text">{props.description}</p>
        </div>
      </div>
    </div>
  );
};

// Add prop types validation
Card.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};
