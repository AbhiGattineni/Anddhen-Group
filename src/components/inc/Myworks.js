import React from 'react';
import { Card } from '../inc/Card'
import { myworks } from '../../dataconfig';

const Myworks = (props) => {
    return (
        <div className='container mb-5'>
            <p className='fs-5 fw-bold'>{props.title}</p>
            <div className="d-flex flex-row flex-nowrap overflow-auto gap-3">
                {myworks.map((work) => (
                    <Card image={work.image} title={work.name} description={work.description} link={work.link} />
                ))}
            </div>
        </div>
    );
}

export default Myworks;