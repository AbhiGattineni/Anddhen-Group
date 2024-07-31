import React from 'react';
import { Card } from '../organisms/Card';
import { myworks } from '../../dataconfig';
import { AssProjectModal } from './Modal/AssProjectModal';

const Myworks = (props) => {
  return (
    <div className="container mb-5">
      <p className="fs-5 fw-bold">{props.title}</p>
      <div className="d-flex flex-row flex-nowrap overflow-auto gap-3">
        {myworks.map((work) => (
          <Card
            image={work.image}
            title={work.name}
            description={work.description}
            link={work.link}
            timeline={work.timeline}
          />
        ))}
      </div>
    </div>
  );
};

export default Myworks;
