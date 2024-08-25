import React from 'react';
import { Card } from '../organisms/Card';
import { myworks } from '../../dataconfig';

import PropTypes from 'prop-types';

const Myworks = (props) => {
  return (
    <div className="container mb-5">
      <p className="fs-5 fw-bold">{props.title}</p>
      <div className="d-flex flex-row flex-nowrap overflow-auto gap-3">
        {myworks.map((work, index) => (
          <div key={index}>
            <Card
              image={work.image}
              title={work.name}
              description={work.description}
              link={work.link}
              timeline={work.timeline}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

Myworks.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Myworks;
