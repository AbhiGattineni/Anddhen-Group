import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const AssignCards = ({ adminPlates }) => {
  if (!adminPlates || adminPlates.length === 0) {
    return <div className="dash-empty">No matching sections found.</div>;
  }

  // No horizontal padding on the row: its negative gutters align the cards flush
  // with the page container, matching the dashboard header above. Padding here
  // indented the grid relative to the heading and search box.
  return (
    <div className="row g-3 g-md-4">
      {adminPlates.map((data, index) => (
        <div className="col-12 col-sm-6 col-lg-4 col-xxl-3" key={`${data.route}-${index}`}>
          <Link to={data.route} className="text-decoration-none">
            <div className="dash-card">
              <span className="dash-icon">
                <i className={`bi ${data.icon || 'bi-grid'}`}></i>
              </span>
              <div className="dash-card-body">
                <h3 className="dash-card-title">{data.child}</h3>
                <p className="dash-card-desc">{data.desc || data.route}</p>
              </div>
              <i className="bi bi-arrow-right dash-card-arrow"></i>
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
      icon: PropTypes.string,
      desc: PropTypes.string,
    })
  ).isRequired,
};

export default AssignCards;
