import React, { useState } from 'react';
import { Card, Collapse } from 'react-bootstrap';
import { FaArrowDown, FaArrowUp, FaChartLine, FaExclamationTriangle } from 'react-icons/fa';
import PropTypes from 'prop-types';

const InvestmentCard = ({ title, icon, description, advantages, disadvantages }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card
      className="h-100 border-0"
      style={{
        background: '#f8fafc',
        borderRadius: '1rem',
        boxShadow: 'none',
        transition: 'box-shadow 0.3s',
      }}
    >
      <Card.Body className="d-flex flex-column justify-content-between">
        <div>
          <div className="d-flex justify-content-center mb-2">{icon}</div>
          <Card.Title
            className="text-center mb-2"
            style={{ fontWeight: 600, fontSize: '1.15rem', color: '#2d3e50' }}
          >
            {title}
          </Card.Title>
          <Card.Text className="text-center mb-3" style={{ color: '#4a6fa1', fontSize: '0.98rem' }}>
            {description}
          </Card.Text>
        </div>
        <div className="d-flex justify-content-end align-items-center mt-auto">
          <span
            role="button"
            aria-expanded={expanded}
            aria-label={expanded ? 'Collapse details' : 'Expand details'}
            onClick={() => setExpanded(prev => !prev)}
            style={{
              cursor: 'pointer',
              fontSize: '1.5rem',
              color: '#4a6fa1',
              transition: 'transform 0.2s',
              transform: expanded ? 'rotate(180deg)' : 'none',
            }}
          >
            {expanded ? <FaArrowUp /> : <FaArrowDown />}
          </span>
        </div>
        <Collapse in={expanded}>
          <div>
            <div className="mt-3">
              <div className="fw-bold mb-1" style={{ color: '#2d3e50', fontSize: '1rem' }}>
                <FaChartLine className="me-2" style={{ color: '#4a6fa1' }} /> Why it’s Beneficial
              </div>
              <ul className="mb-2" style={{ paddingLeft: '1.2rem' }}>
                {advantages.map((adv, i) => (
                  <li
                    key={i}
                    style={{
                      color: '#2d3e50',
                      fontSize: '0.97rem',
                      marginBottom: 2,
                      listStyle: 'disc',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <span style={{ marginRight: 6 }}>
                      <FaChartLine style={{ color: '#4a6fa1' }} />
                    </span>{' '}
                    {adv}
                  </li>
                ))}
              </ul>
              <div className="fw-bold mb-1" style={{ color: '#2d3e50', fontSize: '1rem' }}>
                <FaExclamationTriangle className="me-2" style={{ color: '#e0a800' }} /> Things to
                Consider
              </div>
              <ul style={{ paddingLeft: '1.2rem' }}>
                {disadvantages.map((dis, i) => (
                  <li
                    key={i}
                    style={{
                      color: '#2d3e50',
                      fontSize: '0.97rem',
                      marginBottom: 2,
                      listStyle: 'disc',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <span style={{ marginRight: 6 }}>
                      <FaExclamationTriangle style={{ color: '#e0a800' }} />
                    </span>{' '}
                    {dis}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Collapse>
      </Card.Body>
    </Card>
  );
};

InvestmentCard.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  description: PropTypes.string.isRequired,
  advantages: PropTypes.arrayOf(PropTypes.string).isRequired,
  disadvantages: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default InvestmentCard;
