import React from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import { Link } from 'react-router-dom';

const AssignCards = ({ adminPlates }) => {
  return (
    <div className="row">
      {adminPlates.map((data, index) => (
        <div className="col-md-6 my-3" key={index}>
          <Link to={data.route} className="text-decoration-none">
            <div className="card shadow">
              <div className="card-body">
                <div className="d-flex justify-content-center mb-3">
                  <p className="font-weight-bold">{data.child}</p>
                </div>
                <div className="d-flex justify-content-center">
                  <code>{data.route}</code>
                </div>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

AssignCards.propTypes = {
  adminPlates: PropTypes.arrayOf(
    PropTypes.shape({
      child: PropTypes.string.isRequired,
      route: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default AssignCards;
